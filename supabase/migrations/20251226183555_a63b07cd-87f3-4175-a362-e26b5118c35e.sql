-- Add is_deleted column to jobs table
ALTER TABLE public.jobs ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;

-- Update RLS policy for public view to exclude deleted jobs
DROP POLICY IF EXISTS "Public can view active jobs" ON public.jobs;
CREATE POLICY "Public can view active jobs" ON public.jobs
  FOR SELECT USING (is_active = true AND is_deleted = false);