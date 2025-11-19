-- ============================================================================
-- EMAIL VERIFICATION SYSTEM - COMPLETE MIGRATION
-- 
-- Copy all the code below and paste into Supabase SQL Editor
-- Click "Run" to execute
-- 
-- This creates:
-- 1. RPC function: insert_verification_code()
-- 2. RPC function: verify_email_code()
-- 3. RLS policies for email_verifications table
-- ============================================================================

-- STEP 1: Create the insert_verification_code RPC function
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

GRANT EXECUTE ON FUNCTION public.insert_verification_code(uuid, text, timestamptz) TO authenticated;

-- ============================================================================

-- STEP 2: Create the verify_email_code RPC function
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

GRANT EXECUTE ON FUNCTION public.verify_email_code(uuid, text) TO authenticated;

-- ============================================================================

-- STEP 3: Set up RLS policies for email_verifications table
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own verification codes" ON public.email_verifications;
DROP POLICY IF EXISTS "Service role can insert verification codes" ON public.email_verifications;
DROP POLICY IF EXISTS "Users can view their own verification codes" ON public.email_verifications;
DROP POLICY IF EXISTS "Users can update their own verification status" ON public.email_verifications;

-- Policy 1: Allow authenticated users to insert verification codes
CREATE POLICY "Users can insert verification codes during signup"
  ON public.email_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow service role (Edge Functions) to insert codes
CREATE POLICY "Service role can insert verification codes"
  ON public.email_verifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy 3: Allow users to view only their own verification codes
CREATE POLICY "Users can view their own verification codes"
  ON public.email_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 4: Allow users to update only their own verification status
CREATE POLICY "Users can update their own verification status"
  ON public.email_verifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================

-- VERIFICATION COMPLETE
-- Run this to confirm everything was created:
-- 
-- SELECT proname, prosecdef 
-- FROM pg_proc 
-- WHERE proname IN ('insert_verification_code', 'verify_email_code');
--
-- SELECT policyname, tablename 
-- FROM pg_policies 
-- WHERE tablename = 'email_verifications'
-- ORDER BY policyname;
