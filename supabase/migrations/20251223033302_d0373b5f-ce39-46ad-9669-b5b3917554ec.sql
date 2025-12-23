-- Add pending_job_ids to store selected jobs before user activation
ALTER TABLE public.client_company_access 
ADD COLUMN pending_job_ids uuid[] DEFAULT '{}';