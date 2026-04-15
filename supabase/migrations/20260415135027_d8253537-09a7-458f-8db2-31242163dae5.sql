
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Convenience function for admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- RLS on user_roles: only admins can see roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Assign admin role to Sanjeev
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'sanjeevraoofficial1@gmail.com'
ON CONFLICT DO NOTHING;

-- Drop old permissive INSERT/UPDATE/DELETE policies on task_offers
DROP POLICY IF EXISTS "Users can create tasks" ON public.task_offers;
DROP POLICY IF EXISTS "Creators can update their own tasks" ON public.task_offers;
DROP POLICY IF EXISTS "Creators can delete their own tasks" ON public.task_offers;

-- New policies: only admins can manage tasks
CREATE POLICY "Only admins can create tasks"
ON public.task_offers FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update tasks"
ON public.task_offers FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete tasks"
ON public.task_offers FOR DELETE
TO authenticated
USING (public.is_admin());
