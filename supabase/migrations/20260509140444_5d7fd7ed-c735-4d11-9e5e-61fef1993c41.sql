CREATE TABLE IF NOT EXISTS public.user_task_completions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  task_id uuid NOT NULL,
  coins_awarded integer NOT NULL DEFAULT 0,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_id)
);

ALTER TABLE public.user_task_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own task completions" ON public.user_task_completions;
CREATE POLICY "Users can view their own task completions"
ON public.user_task_completions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own task completions" ON public.user_task_completions;
CREATE POLICY "Users can create their own task completions"
ON public.user_task_completions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.claim_task_reward(_task_id uuid)
RETURNS TABLE(awarded boolean, coins integer, already_claimed boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  task_coins integer;
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT t.coins INTO task_coins
  FROM public.task_offers t
  WHERE t.id = _task_id AND t.is_active = true;

  IF task_coins IS NULL THEN
    RAISE EXCEPTION 'Task not found';
  END IF;

  INSERT INTO public.user_task_completions (user_id, task_id, coins_awarded)
  VALUES (current_user_id, _task_id, task_coins)
  ON CONFLICT (user_id, task_id) DO NOTHING;

  IF FOUND THEN
    UPDATE public.profiles
    SET balance = balance + task_coins,
        tasks_completed = tasks_completed + 1,
        updated_at = now()
    WHERE user_id = current_user_id;

    INSERT INTO public.transactions (user_id, type, amount, description)
    VALUES (current_user_id, 'task_reward', task_coins, 'Task reward credited');

    RETURN QUERY SELECT true, task_coins, false;
  ELSE
    RETURN QUERY SELECT false, task_coins, true;
  END IF;
END;
$$;