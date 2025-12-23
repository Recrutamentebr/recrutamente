-- Drop existing problematic policies on jobs table
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Clients can view their assigned jobs" ON public.jobs;
DROP POLICY IF EXISTS "Companies can view their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Companies can insert their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Companies can update their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Companies can delete their own jobs" ON public.jobs;

-- Create a security definer function to check if user is company owner
CREATE OR REPLACE FUNCTION public.is_job_owner(_job_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.jobs j
    JOIN public.companies c ON c.id = j.company_id
    WHERE j.id = _job_id
      AND c.user_id = _user_id
  )
$$;

-- Create a security definer function to check if user owns the company
CREATE OR REPLACE FUNCTION public.is_company_owner(_company_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.companies c
    WHERE c.id = _company_id
      AND c.user_id = _user_id
  )
$$;

-- Create a security definer function to check client job access
CREATE OR REPLACE FUNCTION public.has_client_job_access(_job_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.client_job_access cja
    WHERE cja.job_id = _job_id
      AND cja.client_user_id = _user_id
  )
$$;

-- Recreate policies for jobs table using the security definer functions

-- Policy: Anyone can view active jobs (public, no auth required)
CREATE POLICY "Public can view active jobs" 
ON public.jobs 
FOR SELECT 
TO anon, authenticated
USING (is_active = true);

-- Policy: Clients can view their assigned jobs (even if inactive)
CREATE POLICY "Clients can view assigned jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated
USING (public.has_client_job_access(id, auth.uid()));

-- Policy: Companies can view all their own jobs
CREATE POLICY "Companies can view own jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated
USING (public.is_company_owner(company_id, auth.uid()));

-- Policy: Companies can insert jobs for their company
CREATE POLICY "Companies can insert jobs" 
ON public.jobs 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_company_owner(company_id, auth.uid()));

-- Policy: Companies can update their own jobs
CREATE POLICY "Companies can update jobs" 
ON public.jobs 
FOR UPDATE 
TO authenticated
USING (public.is_company_owner(company_id, auth.uid()));

-- Policy: Companies can delete their own jobs
CREATE POLICY "Companies can delete jobs" 
ON public.jobs 
FOR DELETE 
TO authenticated
USING (public.is_company_owner(company_id, auth.uid()));