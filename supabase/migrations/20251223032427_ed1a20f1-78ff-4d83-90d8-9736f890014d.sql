-- Add password_set column to track if client has set their password
ALTER TABLE public.client_company_access 
ADD COLUMN password_set boolean NOT NULL DEFAULT false;

-- Make client_user_id nullable (will be set when client creates password)
ALTER TABLE public.client_company_access 
ALTER COLUMN client_user_id DROP NOT NULL;

-- Update RLS policy to allow checking invitations by email
CREATE POLICY "Anyone can check invitations by email"
ON public.client_company_access
FOR SELECT
USING (true);

-- Drop the old restrictive select policy for clients
DROP POLICY IF EXISTS "Clients can view their own access" ON public.client_company_access;