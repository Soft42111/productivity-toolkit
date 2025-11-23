-- Drop the existing function
DROP FUNCTION IF EXISTS public.insert_verification_code(uuid, text, timestamp with time zone);

-- Recreate with correct return type
CREATE OR REPLACE FUNCTION public.insert_verification_code(p_user_id uuid, p_code text, p_expires_at timestamp with time zone)
RETURNS TABLE(id uuid, user_id uuid, code text, expires_at timestamp with time zone, verified boolean, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.email_verifications (user_id, code, expires_at, verified)
  VALUES (p_user_id, p_code, p_expires_at, false)
  RETURNING 
    public.email_verifications.id,
    public.email_verifications.user_id,
    public.email_verifications.code,
    public.email_verifications.expires_at,
    public.email_verifications.verified,
    public.email_verifications.created_at;
END;
$$;