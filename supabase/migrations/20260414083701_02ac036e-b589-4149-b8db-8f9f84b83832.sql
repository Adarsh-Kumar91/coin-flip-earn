
-- Create task_offers table
CREATE TABLE public.task_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  coins INTEGER NOT NULL DEFAULT 100,
  icon TEXT NOT NULL DEFAULT '',
  icon_bg TEXT NOT NULL DEFAULT '#7C3AED',
  steps TEXT[] NOT NULL DEFAULT '{}',
  disclaimer TEXT[] NOT NULL DEFAULT '{}',
  url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.task_offers ENABLE ROW LEVEL SECURITY;

-- Everyone can view active tasks
CREATE POLICY "Anyone can view active tasks"
ON public.task_offers FOR SELECT
USING (is_active = true);

-- Creator can view all their tasks (including inactive)
CREATE POLICY "Creators can view their own tasks"
ON public.task_offers FOR SELECT
TO authenticated
USING (auth.uid() = created_by);

-- Authenticated users can create tasks
CREATE POLICY "Users can create tasks"
ON public.task_offers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Creators can update their own tasks
CREATE POLICY "Creators can update their own tasks"
ON public.task_offers FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

-- Creators can delete their own tasks
CREATE POLICY "Creators can delete their own tasks"
ON public.task_offers FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- Timestamp trigger
CREATE TRIGGER update_task_offers_updated_at
BEFORE UPDATE ON public.task_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
