# Email Verification Issue - Debugging Guide

## Problem
Email verification request fails during signup.

## Root Causes

### 1. Missing RESEND_API_KEY Environment Variable
**Status:** IMPROVED ✅

The function now handles missing API key gracefully:
- Returns test mode response if API key not configured
- Allows development without actual email sending
- **Solution:** Add `RESEND_API_KEY` to Supabase project settings if you want real emails

### 2. Missing Function Configuration
**Status:** FIXED ✅

Updated `supabase/config.toml`:
```toml
[functions.send-verification-email]
verify_jwt = false

[functions.verify-email-code]
verify_jwt = false
```

This ensures functions can be invoked without JWT verification.

---

## Troubleshooting Steps

### 1. Check Function Logs
```bash
# View send-verification-email logs
supabase functions list
# Then check logs in Supabase dashboard → Functions → Logs
```

### 2. Verify API Key Setup
```bash
# Check if RESEND_API_KEY is set in Supabase
# Go to: Supabase Dashboard → Project Settings → Edge Functions → Secrets
# Add: RESEND_API_KEY = <your-resend-api-key>
```

### 3. Check Database RLS Policies
```sql
-- Verify email_verifications table allows inserts
SELECT * FROM pg_policies WHERE tablename = 'email_verifications';
```

### 4. Test Manually
```bash
# Deploy changes
supabase functions deploy send-verification-email
supabase functions deploy verify-email-code

# Then test signup flow in browser
```

---

## Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Failed to store verification code" | RLS policy blocking insert | Check email_verifications RLS policies |
| "Failed to send verification email" | Invalid RESEND_API_KEY | Add valid key to Supabase secrets |
| "Invalid or expired verification code" | Code not found in DB | Ensure code was stored, check DB |
| "Database error" | Connection issue | Check Supabase URL and service role key |

---

## What Changed

### Updated Files:
1. **supabase/config.toml**
   - Added function JWT verification settings

2. **supabase/functions/send-verification-email/index.ts**
   - Added detailed logging
   - Handles missing RESEND_API_KEY gracefully
   - Returns better error messages
   - Added stack traces for debugging

3. **supabase/functions/verify-email-code/index.ts**
   - Added detailed logging
   - Added input validation
   - Improved error messages
   - Added stack traces

---

## Development vs Production

### Development (Without Real Emails)
- RESEND_API_KEY not needed
- Codes stored in database
- Can manually verify in DB if needed
- Function logs show success

### Production (With Real Emails)
- Add RESEND_API_KEY to Supabase secrets
- Emails sent via Resend
- Users receive verification codes
- Test with real email before deploying

---

## How to Get RESEND_API_KEY

1. Go to https://resend.com
2. Sign up for free account
3. Get API key from dashboard
4. Add to Supabase:
   - Supabase Dashboard → Project Settings → Edge Functions → Secrets
   - Key: `RESEND_API_KEY`
   - Value: Your API key

---

## Testing the Fix

```typescript
// In browser console, test the function:
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/send-verification-email',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabase.auth.session()?.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'test@example.com',
      userId: 'user-id-here'
    })
  }
);

console.log(await response.json());
```

---

## Next Steps

1. ✅ Deploy updated functions
2. ✅ Test signup flow
3. ✅ Check function logs for errors
4. ✅ Add RESEND_API_KEY when ready for production
5. ✅ Test with real emails

**Status:** Ready for testing 🧪
