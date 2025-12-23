-- Allow companies to delete applications for their jobs
CREATE POLICY "Companies can delete applications for their jobs"
ON public.applications
FOR DELETE
USING (EXISTS (
  SELECT 1
  FROM jobs
  JOIN companies ON companies.id = jobs.company_id
  WHERE jobs.id = applications.job_id AND companies.user_id = auth.uid()
));