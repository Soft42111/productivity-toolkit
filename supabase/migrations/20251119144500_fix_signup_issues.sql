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
