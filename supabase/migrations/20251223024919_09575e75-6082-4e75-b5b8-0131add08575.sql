-- Adicionar coluna para email do cliente na tabela de acesso
ALTER TABLE public.client_company_access 
ADD COLUMN client_email TEXT;

-- Criar tabela para vincular clientes a vagas específicas
CREATE TABLE public.client_job_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_user_id, job_id)
);

-- Enable RLS
ALTER TABLE public.client_job_access ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para client_job_access
CREATE POLICY "Companies can manage their client job access"
ON public.client_job_access
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.companies c ON c.id = j.company_id
    WHERE j.id = client_job_access.job_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Clients can view their own job access"
ON public.client_job_access
FOR SELECT
USING (client_user_id = auth.uid());

-- Atualizar política de applications para usar client_job_access ao invés de client_company_access
DROP POLICY IF EXISTS "Clients can view applications for their assigned companies" ON public.applications;

CREATE POLICY "Clients can view applications for their assigned jobs"
ON public.applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.client_job_access cja
    WHERE cja.client_user_id = auth.uid()
    AND cja.job_id = applications.job_id
  )
);

-- Atualizar política de jobs para usar client_job_access
DROP POLICY IF EXISTS "Clients can view jobs from assigned companies" ON public.jobs;

CREATE POLICY "Clients can view their assigned jobs"
ON public.jobs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.client_job_access cja
    WHERE cja.client_user_id = auth.uid()
    AND cja.job_id = jobs.id
  )
);