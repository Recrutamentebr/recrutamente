-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'company', 'candidate');

-- Criar tabela de perfis de empresas
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  cnpj TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar tabela de vagas
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  benefits TEXT,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'CLT',
  level TEXT NOT NULL DEFAULT 'Pleno',
  salary_range TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de candidaturas
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  education_level TEXT NOT NULL,
  experience TEXT NOT NULL,
  salary_expectation TEXT,
  availability TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  additional_info TEXT,
  resume_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de roles de usuários
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar role do usuário
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Políticas RLS para companies
CREATE POLICY "Companies can view their own profile"
  ON public.companies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Companies can insert their own profile"
  ON public.companies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Companies can update their own profile"
  ON public.companies
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para jobs
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Companies can view their own jobs"
  ON public.jobs
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id = jobs.company_id
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Companies can insert their own jobs"
  ON public.jobs
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id = jobs.company_id
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Companies can update their own jobs"
  ON public.jobs
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id = jobs.company_id
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Companies can delete their own jobs"
  ON public.jobs
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id = jobs.company_id
    AND companies.user_id = auth.uid()
  ));

-- Políticas RLS para applications
CREATE POLICY "Anyone can insert applications"
  ON public.applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Companies can view applications for their jobs"
  ON public.applications
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.jobs
    JOIN public.companies ON companies.id = jobs.company_id
    WHERE jobs.id = applications.job_id
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Companies can update applications for their jobs"
  ON public.applications
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.jobs
    JOIN public.companies ON companies.id = jobs.company_id
    WHERE jobs.id = applications.job_id
    AND companies.user_id = auth.uid()
  ));

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Função para criar perfil de empresa após signup
CREATE OR REPLACE FUNCTION public.handle_new_company_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Adicionar role de company
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'company');
  
  -- Criar perfil da empresa
  INSERT INTO public.companies (user_id, company_name, contact_email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', 'Minha Empresa'),
    NEW.email
  );
  
  RETURN NEW;
END;
$$;

-- Trigger para novo usuário empresa
CREATE TRIGGER on_auth_user_created_company
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data ->> 'user_type' = 'company')
  EXECUTE FUNCTION public.handle_new_company_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket para currículos
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Política para upload de currículos (público pode enviar)
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'resumes');

-- Política para empresas visualizarem currículos
CREATE POLICY "Authenticated users can view resumes"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');