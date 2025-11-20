-- Create the insert_verification_code RPC function
-- This function bypasses RLS with SECURITY DEFINER
DROP FUNCTION IF EXISTS public.insert_verification_code(uuid, text, timestamptz);

CREATE FUNCTION public.insert_verification_code(
  p_user_id uuid,
  p_code text,
  p_expires_at timestamptz
)
RETURNS TABLE (
  id bigint,
  user_id uuid,
  code text,
  expires_at timestamptz,
  verified boolean,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.email_verifications (user_id, code, expires_at, verified)
  VALUES (p_user_id, p_code, p_expires_at, false)
  RETURNING 
    public.email_verifications.id::bigint,
    public.email_verifications.user_id,
    public.email_verifications.code,
    public.email_verifications.expires_at,
    public.email_verifications.verified,
    public.email_verifications.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.insert_verification_code(uuid, text, timestamptz) TO authenticated, anon;

-- Create the verify_email_code RPC function
-- This function validates and marks code as verified
DROP FUNCTION IF EXISTS public.verify_email_code(uuid, text);

CREATE FUNCTION public.verify_email_code(
  p_user_id uuid,
  p_code text
)
RETURNS TABLE (
  success boolean,
  message text
) AS $$
DECLARE
  v_verification_id text;
BEGIN
  -- Find the verification record
  SELECT id::text INTO v_verification_id
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

  -- Mark as verified
  UPDATE public.email_verifications
  SET verified = true
  WHERE id::text = v_verification_id;

  RETURN QUERY SELECT true, 'Email verified successfully'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.verify_email_code(uuid, text) TO authenticated, anon;