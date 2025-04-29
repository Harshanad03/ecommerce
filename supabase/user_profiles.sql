-- Drop if exists
DROP TABLE IF EXISTS public.user_profiles;

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    id uuid primary key references auth.users on delete cascade,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone_number text,
    address text not null,
    city text not null,
    state text not null,
    postal_code text not null,
    country text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "user_profiles_select_policy" 
    ON user_profiles FOR SELECT 
    USING (auth.uid() = id);

-- Allow profile creation during signup
CREATE POLICY "user_profiles_insert_policy" 
    ON user_profiles FOR INSERT 
    WITH CHECK (true);  -- Allow any authenticated user to insert

CREATE POLICY "user_profiles_update_policy" 
    ON user_profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(id);
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

