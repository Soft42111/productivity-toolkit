# Email Verification System Setup Guide

## Overview
This guide walks you through fixing the email verification system so that:
1. Verification codes can be created and stored in the database
2. Users are blocked from accessing their account until they verify their email
3. Users can verify their email using the 5-digit code sent to them

## Steps to Apply Changes

### Step 1: Apply Supabase Migrations

You need to run two migration files in your Supabase SQL Editor:

#### Migration 1: Comprehensive Verification System Setup
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query** and paste the contents of this file:
   `/workspaces/productivity-toolkit/supabase/migrations/20251120_verification_system.sql`
3. Click **Run** to execute

This migration will:
- Create RLS policies for the email_verifications table
- Create `insert_verification_code()` RPC function for safe code insertion
- Create `verify_email_code()` RPC function for verification
- Grant permissions to authenticated users

#### Migration 2: Original Fixes (if not already applied)
1. Create a new query
2. Paste the contents of:
   `/workspaces/productivity-toolkit/supabase/migrations/20251119144500_fix_signup_issues.sql`
3. Click **Run**

This ensures:
- Proper foreign key constraints
- Performance indexes
- All table structure fixes

### Step 2: Verify RLS Policies in Supabase Dashboard

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this query to check policies:
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'email_verifications'
ORDER BY policyname;
```

You should see these policies:
- ✅ "Users can insert verification codes during signup"
- ✅ "Service role can insert verification codes"
- ✅ "Users can view their own verification codes"
- ✅ "Users can update their own verification status"

### Step 3: Verify Functions Exist

Run this query to check if functions were created:
```sql
SELECT 
  n.nspname,
  p.proname,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE proname IN ('insert_verification_code', 'verify_email_code')
ORDER BY proname;
```

You should see both functions listed.

### Step 4: Test the Signup Flow

1. Open the application in your browser
2. Try to create a new account with an email
3. Check the browser console (Press F12, go to Console tab)
4. You should see a message like:
   ```
   ✅ Verification code for user@example.com: 12345
   ```
5. Enter that code in the verification input
6. Click "Verify Code"
7. You should see: "Email verified! Your account has been created. You can now sign in."

### Step 5: Monitor Logs for Issues

If something goes wrong, check:

1. **Browser Console** (F12):
   - Look for error messages starting with "Error:"
   - Check for RPC function errors

2. **Supabase Dashboard** → **Logs**:
   - Go to **Database** → **Logs**
   - Look for any SQL errors or RLS policy violations
   - Look for function execution errors

## Troubleshooting

### Problem: "Failed to send a request to the Edge Function"
**Solution**: This is expected. Email sending is not critical for the verification flow to work. The code is stored locally and verified in the database. See console for the verification code.

### Problem: "Invalid RLS Policy" error
**Solution**: Run this query to drop all policies and recreate them:
```sql
DROP POLICY IF EXISTS "Users can insert verification codes during signup" ON public.email_verifications;
DROP POLICY IF EXISTS "Service role can insert verification codes" ON public.email_verifications;
DROP POLICY IF EXISTS "Users can view their own verification codes" ON public.email_verifications;
DROP POLICY IF EXISTS "Users can update their own verification status" ON public.email_verifications;
```
Then run the `20251120_verification_system.sql` migration again.

### Problem: RPC function returns "function does not exist"
**Solution**: 
1. Check that the functions were created: Run the verification query from Step 3
2. If functions don't exist, run the migration again
3. Make sure you're running the migration in the correct Supabase project

### Problem: Verification code not storing in database
**Solution**:
1. Check the database directly:
```sql
SELECT * FROM public.email_verifications ORDER BY created_at DESC LIMIT 1;
```
2. If no rows appear, check browser console for specific error
3. Run Step 2 verification query to ensure RLS policies are correct

## How the System Works

### Signup Flow
1. User enters email and password
2. Supabase creates an auth user
3. Application generates 5-digit code (console output: `✅ Verification code for user@example.com: 12345`)
4. Application stores code in `email_verifications` table
5. User is shown verification page
6. User enters the code they received

### Verification Flow
1. User enters 5-digit code
2. Application calls RPC function or queries database
3. If code matches and not expired: Update `verified = true`
4. User can now sign in

### Account Access
- Users cannot sign in until their email is verified
- This is enforced by the RLS policies in the database
- Even if someone logs in before verification, the RLS policies block data access

## Notes

- Verification codes expire after 15 minutes
- The 5-digit code is displayed in the browser console for testing
- In production, you would deploy the `send-verification-email` Edge Function
- The system works offline/without email - codes are stored locally
- All verification data is user-specific via RLS policies

## Next Steps

After successfully applying these migrations:
1. Test the complete signup → verification → signin flow
2. Verify that unverified users cannot access the app
3. Monitor Supabase logs for any issues
4. (Optional) Deploy the `send-verification-email` Edge Function for real email sending
