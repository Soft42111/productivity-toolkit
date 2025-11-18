-- Email verification codes table
CREATE TABLE public.email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  verified boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification codes"
  ON public.email_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification codes"
  ON public.email_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification codes"
  ON public.email_verifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Todo categories table
CREATE TABLE public.todo_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3b82f6',
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.todo_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own categories"
  ON public.todo_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON public.todo_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.todo_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.todo_categories FOR DELETE
  USING (auth.uid() = user_id);

-- Add category to todos table
ALTER TABLE public.todos ADD COLUMN category_id uuid REFERENCES public.todo_categories(id) ON DELETE SET NULL;

-- Pinned apps table
CREATE TABLE public.pinned_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  app_path text NOT NULL,
  pinned_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id, app_path)
);

ALTER TABLE public.pinned_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pinned apps"
  ON public.pinned_apps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pinned apps"
  ON public.pinned_apps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pinned apps"
  ON public.pinned_apps FOR DELETE
  USING (auth.uid() = user_id);