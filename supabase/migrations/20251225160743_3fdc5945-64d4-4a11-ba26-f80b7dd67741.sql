-- Create function to activate client access for current user
CREATE OR REPLACE FUNCTION public.activate_client_access_for_current_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_email TEXT;
  v_user_id UUID;
  v_access RECORD;
BEGIN
  -- Get current user id and email from JWT
  v_user_id := auth.uid();
  v_user_email := auth.jwt() ->> 'email';
  
  IF v_user_id IS NULL OR v_user_email IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Find all pending invitations for this email and activate them
  FOR v_access IN 
    SELECT id, pending_job_ids
    FROM client_company_access
    WHERE LOWER(client_email) = LOWER(v_user_email)
      AND (password_set = false OR client_user_id IS NULL)
  LOOP
    -- Update the access record
    UPDATE client_company_access
    SET client_user_id = v_user_id,
        password_set = true
    WHERE id = v_access.id;
    
    -- Transfer pending jobs to client_job_access
    IF v_access.pending_job_ids IS NOT NULL AND array_length(v_access.pending_job_ids, 1) > 0 THEN
      INSERT INTO client_job_access (client_user_id, job_id)
      SELECT v_user_id, unnest(v_access.pending_job_ids)
      ON CONFLICT (client_user_id, job_id) DO NOTHING;
    END IF;
  END LOOP;
END;
$$;

-- Add unique constraint to client_job_access to prevent duplicates
ALTER TABLE public.client_job_access 
ADD CONSTRAINT client_job_access_user_job_unique UNIQUE (client_user_id, job_id);