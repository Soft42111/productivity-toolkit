-- COMPREHENSIVE FIX FOR EMAIL VERIFICATION SYSTEM
-- This migration ensures verification codes can be inserted without RLS blocking them

-- Step 1: Ensure email_verifications table exists with proper columns
-- (already created, just making sure structure is correct)

-- Step 2: Drop old RLS policies
DROP POLICY IF EXISTS "Users can insert their own verification codes" ON public.email_verifications;
DROP POLICY IF EXISTS "Service role can insert verification codes" ON public.email_verifications;

-- Step 3: Create new RLS policies that allow both authenticated users AND service role to insert
-- For authenticated users creating their own verification codes
CREATE POLICY "Users can insert verification codes during signup"
  ON public.email_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- For service role (which includes Edge Functions)
CREATE POLICY "Service role can insert verification codes"
  ON public.email_verifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow users to read their own verification records
DROP POLICY IF EXISTS "Users can view their own verification codes" ON public.email_verifications;
CREATE POLICY "Users can view their own verification codes"
  ON public.email_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to update their own verification records
DROP POLICY IF EXISTS "Users can update their own verification status" ON public.email_verifications;
CREATE POLICY "Users can update their own verification status"
  ON public.email_verifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 4: Create a database function to handle verification code insertion
-- This runs with definer privileges and can bypass RLS
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.insert_verification_code(uuid, text, timestamptz) TO authenticated;

-- Step 5: Create a function to verify the code
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
  v_verification_id bigint;
BEGIN
  -- Find the verification record
  SELECT id INTO v_verification_id
  FROM public.email_verifications
  WHERE user_id = p_user_id
    AND code = p_code
    AND verified = false
    AND expires_at > now()
  LIMIT 1;

  IF v_verification_id IS NULL THEN
    RETURN QUERY SELECT false, 'Invalid or expired verification code'::text;
    RETURN;
  END IF;

  -- Mark as verified
  UPDATE public.email_verifications
  SET verified = true
  WHERE id = v_verification_id;

  RETURN QUERY SELECT true, 'Email verified successfully'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.verify_email_code(uuid, text) TO authenticated;
