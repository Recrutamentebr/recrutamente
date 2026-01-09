-- Correção 1: Transferir jobs pendentes para clientes já ativados
INSERT INTO client_job_access (client_user_id, job_id)
SELECT 
  cca.client_user_id, 
  unnest(cca.pending_job_ids) as job_id
FROM client_company_access cca
WHERE cca.password_set = true 
  AND cca.client_user_id IS NOT NULL
  AND cca.pending_job_ids IS NOT NULL
  AND array_length(cca.pending_job_ids, 1) > 0
ON CONFLICT (client_user_id, job_id) DO NOTHING;

-- Correção 2: Corrigir política RLS de client_company_access (remover acesso público)
DROP POLICY IF EXISTS "Anyone can check invitations by email" ON client_company_access;

CREATE POLICY "Users can check their own invitations"
ON client_company_access FOR SELECT
USING (
  LOWER(client_email) = LOWER(auth.jwt() ->> 'email')
  OR EXISTS (
    SELECT 1 FROM companies c 
    WHERE c.id = client_company_access.company_id 
    AND c.user_id = auth.uid()
  )
);

-- Correção 3: Política de storage para upload anônimo de currículos
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can read resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');