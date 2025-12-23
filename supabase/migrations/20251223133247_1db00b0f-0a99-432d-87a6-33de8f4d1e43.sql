-- Add custom_questions column to jobs table (stores array of selected question IDs)
ALTER TABLE public.jobs 
ADD COLUMN custom_questions JSONB DEFAULT '[]'::jsonb;

-- Add custom_answers column to applications table (stores candidate responses)
ALTER TABLE public.applications 
ADD COLUMN custom_answers JSONB DEFAULT '{}'::jsonb;