
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  referral_code TEXT NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  referrer_reward INTEGER NOT NULL DEFAULT 200,
  referred_reward INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earn', 'referral_bonus', 'redeem', 'withdraw')),
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can look up profiles by referral code" ON public.profiles FOR SELECT USING (true);

-- Referrals policies
CREATE POLICY "Users can view their own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can create referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referred_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_code TEXT;
  user_name TEXT;
  referrer_uid UUID;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1));
  ref_code := UPPER(REPLACE(user_name, ' ', '')) || '-' || SUBSTR(MD5(RANDOM()::TEXT), 1, 4);
  
  INSERT INTO public.profiles (user_id, display_name, email, referral_code, balance)
  VALUES (NEW.id, user_name, NEW.email, ref_code, 0);

  -- Check if user signed up with a referral code
  IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
    SELECT user_id INTO referrer_uid FROM public.profiles WHERE referral_code = NEW.raw_user_meta_data->>'referred_by';
    IF referrer_uid IS NOT NULL THEN
      INSERT INTO public.referrals (referrer_id, referred_id) VALUES (referrer_uid, NEW.id);
      UPDATE public.profiles SET balance = balance + 100 WHERE user_id = NEW.id;
      UPDATE public.profiles SET balance = balance + 200 WHERE user_id = referrer_uid;
      UPDATE public.referrals SET status = 'completed' WHERE referrer_id = referrer_uid AND referred_id = NEW.id;
      INSERT INTO public.transactions (user_id, type, amount, description) VALUES (NEW.id, 'referral_bonus', 100, 'Signup bonus via referral');
      INSERT INTO public.transactions (user_id, type, amount, description) VALUES (referrer_uid, 'referral_bonus', 200, 'Referral bonus for inviting ' || user_name);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
