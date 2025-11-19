-- Create a function to insert verification codes
-- This function is executed with function privileges, bypassing RLS

CREATE OR REPLACE FUNCTION insert_verification_code(
  p_user_id uuid,
  p_code text,
  p_expires_at timestamptz
)
RETURNS TABLE (
  id bigint,
  user_id uuid,
  code text,
  expires_at timestamptz,
  verified boolean
) AS $$
BEGIN
  INSERT INTO public.email_verifications (user_id, code, expires_at, verified)
  VALUES (p_user_id, p_code, p_expires_at, false)
  RETURNING 
    public.email_verifications.id,
    public.email_verifications.user_id,
    public.email_verifications.code,
    public.email_verifications.expires_at,
    public.email_verifications.verified;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION insert_verification_code(uuid, text, timestamptz) TO authenticated;
