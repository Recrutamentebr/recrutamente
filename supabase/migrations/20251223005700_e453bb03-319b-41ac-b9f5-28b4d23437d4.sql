-- Add external form URL field to jobs table
ALTER TABLE public.jobs 
ADD COLUMN external_form_url text DEFAULT NULL;