-- Adicionar 'client' ao enum app_role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';

-- Tabela para vincular clientes a empresas
CREATE TABLE public.client_company_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  UNIQUE(client_user_id, company_id)
);

-- Enable RLS
ALTER TABLE public.client_company_access ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para client_company_access
CREATE POLICY "Companies can manage their client access"
ON public.client_company_access
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id = client_company_access.company_id
    AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can view their own access"
ON public.client_company_access
FOR SELECT
USING (client_user_id = auth.uid());

-- Atualizar política de applications para clientes poderem ver
CREATE POLICY "Clients can view applications for their assigned companies"
ON public.applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.client_company_access cca
    JOIN public.jobs j ON j.company_id = cca.company_id
    WHERE cca.client_user_id = auth.uid()
    AND j.id = applications.job_id
  )
);

-- Política para clientes verem vagas das empresas atribuídas
CREATE POLICY "Clients can view jobs from assigned companies"
ON public.jobs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.client_company_access cca
    WHERE cca.client_user_id = auth.uid()
    AND cca.company_id = jobs.company_id
  )
);

-- Função para criar cliente (será chamada pelo admin)
CREATE OR REPLACE FUNCTION public.handle_new_client_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Adicionar role de client se for do tipo client
  IF NEW.raw_user_meta_data ->> 'user_type' = 'client' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'client');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para novos clientes
CREATE TRIGGER on_auth_client_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data ->> 'user_type' = 'client')
  EXECUTE FUNCTION public.handle_new_client_user();