-- Criar função SECURITY DEFINER para transferir pending_job_ids para client_job_access
CREATE OR REPLACE FUNCTION transfer_pending_jobs_to_access(
  p_client_user_id UUID,
  p_access_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_ids UUID[];
BEGIN
  -- Get pending job ids from client_company_access
  SELECT pending_job_ids INTO v_job_ids
  FROM client_company_access
  WHERE id = p_access_id;

  -- Insert into client_job_access for each pending job
  IF v_job_ids IS NOT NULL AND array_length(v_job_ids, 1) > 0 THEN
    INSERT INTO client_job_access (client_user_id, job_id)
    SELECT p_client_user_id, unnest(v_job_ids)
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;