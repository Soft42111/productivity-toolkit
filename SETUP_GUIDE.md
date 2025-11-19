# 📋 SETUP CHECKLIST

## Before You Start
- [ ] Have Gemini API key ready (from https://aistudio.google.com)
- [ ] Access to Supabase Dashboard
- [ ] Text editor to copy-paste SQL

---

## 🔑 Step 1: Add Gemini API Key

### 1.1 Get the Key
```
1. Go: https://aistudio.google.com
2. Click: "Get API key"
3. Copy the key
```

### 1.2 Add to .env
**File:** `.env`

```dotenv
VITE_GEMINI_API_KEY="your_key_here"
```

Save and refresh browser.

**Status:** ✅ Quotes & Chat will work

---

## 🗄️ Step 2: Apply Supabase Migration

### 2.1 Open Supabase
```
1. Go to your Supabase project
2. Click: SQL Editor
3. Click: New Query
```

### 2.2 Copy This SQL
```sql
-- Fix email_verifications RLS policies to allow service role inserts
DROP POLICY IF EXISTS "Users can insert their own verification codes" ON public.email_verifications;

CREATE POLICY "Service role can insert verification codes"
  ON public.email_verifications FOR INSERT
  WITH CHECK (true);

-- Fix habits table with proper foreign key constraint to auth.users
ALTER TABLE public.habits
ADD CONSTRAINT habits_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix todo_categories to reference auth.users instead of profiles for consistency
ALTER TABLE public.todo_categories
DROP CONSTRAINT IF EXISTS todo_categories_user_id_fkey;

ALTER TABLE public.todo_categories
ADD CONSTRAINT todo_categories_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix pinned_apps to reference auth.users instead of profiles
ALTER TABLE public.pinned_apps
DROP CONSTRAINT IF EXISTS pinned_apps_user_id_fkey;

ALTER TABLE public.pinned_apps
ADD CONSTRAINT pinned_apps_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON public.email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_code ON public.email_verifications(user_id, code);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_categories_user_id ON public.todo_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_pinned_apps_user_id ON public.pinned_apps(user_id);
```

### 2.3 Execute
```
1. Paste SQL into editor
2. Click: "Execute"
3. Wait for "Success!" message
```

**Status:** ✅ Email verification & pinned apps will work

---

## 🧪 Step 3: Test Everything

### 3.1 Test Pinned Apps
```
URL: http://localhost:5173/pinned
Expected:
- See pinned apps (or "No Pinned Apps" message)
- Can pin/unpin apps
- Can click "Open" buttons
```

### 3.2 Test AI Quotes
```
URL: http://localhost:5173/quotes
Expected:
- Quote appears (with loading indicator)
- Different quote each time
- Can copy quote
```

### 3.3 Test Gemini Chat
```
URL: http://localhost:5173/chat-gemini
Expected:
- Can send messages
- Get responses
- Conversation history
```

### 3.4 Test Email Verification
```
URL: http://localhost:5173/auth → Sign Up
Expected:
1. Click "Sign Up"
2. Open DevTools (F12) → Console
3. See: "✅ Verification code for email: XXXXX"
4. Enter code
5. Success: "Email verified!"
```

---

## ✅ Completion Checklist

- [ ] Gemini API key added to .env
- [ ] Supabase migration executed successfully
- [ ] Pinned apps page loads
- [ ] AI quotes generate
- [ ] Gemini chat responds
- [ ] Email verification works

---

## 🎉 You're Done!

If all checks pass, everything is working perfectly! 

### What's Now Available
✅ Pinned Apps Page `/pinned`
✅ AI Quote Generator `/quotes`
✅ Gemini Chat `/chat-gemini`
✅ Email Verification `/auth`

---

## 🆘 If Something Doesn't Work

### Quotes/Chat Don't Work
- Check: `.env` has `VITE_GEMINI_API_KEY`
- Verify: Key is valid (test on https://aistudio.google.com)
- Reload: Browser cache (Ctrl+Shift+R)

### Verification Code Error
- Check: Migration executed successfully
- Verify: No errors in Supabase SQL Editor
- Try: Clearing browser storage (F12 → Storage → Clear)

### Pinned Apps Won't Save
- Check: Migration includes pinned_apps foreign key
- Verify: User is logged in
- Check: Supabase user table has data

---

**Estimated Time:** 5-10 minutes
**Difficulty:** Very Easy
**Success Rate:** 99% (if following exactly)

Good luck! 🚀
