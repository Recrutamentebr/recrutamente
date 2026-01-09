-- 1. Adicionar colunas LGPD em applications
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS lgpd_consent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS lgpd_consent_ip TEXT;

-- 2. Adicionar coluna can_edit em client_job_access
ALTER TABLE public.client_job_access 
ADD COLUMN IF NOT EXISTS can_edit BOOLEAN DEFAULT false;

-- 3. Criar tabela de aceite de termos de clientes
CREATE TABLE IF NOT EXISTS public.client_terms_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  term_version TEXT NOT NULL DEFAULT '1.0',
  term_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_user_id, company_id, term_version)
);

-- Enable RLS
ALTER TABLE public.client_terms_acceptance ENABLE ROW LEVEL SECURITY;

-- RLS Policies para client_terms_acceptance
CREATE POLICY "Clients can insert their own acceptance"
ON public.client_terms_acceptance FOR INSERT
WITH CHECK (client_user_id = auth.uid());

CREATE POLICY "Clients can view their own acceptances"
ON public.client_terms_acceptance FOR SELECT
USING (client_user_id = auth.uid());

CREATE POLICY "Companies can view acceptances for their company"
ON public.client_terms_acceptance FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.companies c 
  WHERE c.id = client_terms_acceptance.company_id 
  AND c.user_id = auth.uid()
));

-- 4. Corrigir jobs pendentes não transferidos para clientes já ativados
INSERT INTO public.client_job_access (client_user_id, job_id)
SELECT cca.client_user_id, unnest(cca.pending_job_ids)
FROM public.client_company_access cca
WHERE cca.password_set = true 
  AND cca.client_user_id IS NOT NULL
  AND cca.pending_job_ids IS NOT NULL
  AND array_length(cca.pending_job_ids, 1) > 0
ON CONFLICT (client_user_id, job_id) DO NOTHING;

-- 5. Atualizar RLS para permitir clientes atualizarem vagas com permissão
CREATE POLICY "Clients can update jobs they have edit access to"
ON public.jobs FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.client_job_access cja
    WHERE cja.job_id = jobs.id
    AND cja.client_user_id = auth.uid()
    AND cja.can_edit = true
  )
);