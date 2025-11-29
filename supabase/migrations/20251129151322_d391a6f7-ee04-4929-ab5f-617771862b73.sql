-- Drop the old function
DROP FUNCTION IF EXISTS public.verify_email_code(uuid, text);

-- Create updated function that actually confirms the email in Supabase
CREATE OR REPLACE FUNCTION public.verify_email_code(p_user_id uuid, p_code text)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_verification_id uuid;
BEGIN
  -- Find the verification record
  SELECT id INTO v_verification_id
  FROM public.email_verifications
  WHERE user_id = p_user_id
    AND code = p_code
    AND verified = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_verification_id IS NULL THEN
    RETURN QUERY SELECT false, 'Invalid or expired verification code'::text;
    RETURN;
  END IF;

  -- Mark verification as complete
  UPDATE public.email_verifications
  SET verified = true
  WHERE id = v_verification_id;

  -- Confirm the email in auth.users table
  UPDATE auth.users
  SET email_confirmed_at = now(),
      confirmed_at = now()
  WHERE id = p_user_id;

  RETURN QUERY SELECT true, 'Email verified successfully'::text;
END;
$$;