-- Create function to unconfirm a user's email (for custom verification flow)
CREATE OR REPLACE FUNCTION public.unconfirm_user_email(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Unconfirm the email in auth.users table
  UPDATE auth.users
  SET email_confirmed_at = NULL,
      confirmed_at = NULL
  WHERE id = p_user_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;