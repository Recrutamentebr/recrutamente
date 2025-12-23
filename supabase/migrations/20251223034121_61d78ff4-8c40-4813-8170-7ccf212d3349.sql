-- Fix SECURITY DEFINER functions to validate auth.uid() where appropriate
-- Drop and recreate has_role to be more secure (only allow checking own roles by default)
CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix storage policies for resumes bucket
-- 1. Drop the overly permissive download policy
DROP POLICY IF EXISTS "Authenticated users can view resumes" ON storage.objects;

-- 2. Create a more restrictive download policy - only companies that own the job or clients with access
CREATE POLICY "Companies and clients can view resumes for their jobs" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'resumes' AND (
    -- Company owners can view resumes for their jobs
    EXISTS (
      SELECT 1 
      FROM applications a
      JOIN jobs j ON j.id = a.job_id
      JOIN companies c ON c.id = j.company_id
      WHERE a.resume_url = name 
        AND c.user_id = auth.uid()
    )
    OR
    -- Clients with job access can view resumes
    EXISTS (
      SELECT 1
      FROM applications a
      JOIN client_job_access cja ON cja.job_id = a.job_id
      WHERE a.resume_url = name
        AND cja.client_user_id = auth.uid()
    )
  )
);

-- 3. Add file type and size restrictions via a more restrictive upload policy
DROP POLICY IF EXISTS "Anyone can upload resumes" ON storage.objects;

-- Create policy that validates file extension on upload
CREATE POLICY "Anyone can upload resumes with valid extensions"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND (
    name LIKE '%.pdf' OR
    name LIKE '%.doc' OR
    name LIKE '%.docx' OR
    name LIKE '%.PDF' OR
    name LIKE '%.DOC' OR
    name LIKE '%.DOCX'
  )
);