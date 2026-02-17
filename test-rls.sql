-- Test RLS Policies for fire_settings
-- Run as authenticated user

-- Create test user (using auth.users)
INSERT INTO auth.users (id, email)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

-- Test INSERT policy
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub":"123e4567-e89b-12d3-a456-426614174000"}';

INSERT INTO public.fire_settings (user_id, investment_return_rate, safe_withdrawal_rate)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 7.0, 4.0);

-- Test SELECT policy
SELECT * FROM public.fire_settings WHERE user_id = '123e4567-e89b-12d3-a456-426614174000';

-- Test UPDATE policy
UPDATE public.fire_settings 
SET investment_return_rate = 8.0 
WHERE user_id = '123e4567-e89b-12d3-a456-426614174000';

-- Test DELETE policy
DELETE FROM public.fire_settings WHERE user_id = '123e4567-e89b-12d3-a456-426614174000';
