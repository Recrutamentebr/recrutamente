-- Atualizar a empresa "Recrutamente Admin" para apontar para o usuário denyslira.adv@gmail.com
UPDATE companies 
SET user_id = '61c722a7-1d70-4a9f-a039-86e90eeb4538'
WHERE id = 'cb1a1018-8f77-43aa-adb4-d13b917ddaaa';

-- Atualizar a role do usuário de 'client' para 'company'
UPDATE user_roles 
SET role = 'company'
WHERE user_id = '61c722a7-1d70-4a9f-a039-86e90eeb4538';

-- Atualizar os metadados do auth para refletir o tipo correto
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{user_type}', '"company"')
WHERE id = '61c722a7-1d70-4a9f-a039-86e90eeb4538';