    -- Drop existing objects
drop policy if exists "Enable all access for own profile" on public.user_profiles;
drop trigger if exists handle_updated_at on public.user_profiles;
drop function if exists public.handle_updated_at();
drop table if exists public.user_profiles;

-- Create the user_profiles table
create table public.user_profiles (
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

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- Create separate policies for different operations
create policy "Enable read for users"
    on public.user_profiles
    for select
    using (auth.uid() = id);

create policy "Enable insert for users"
    on public.user_profiles
    for insert
    with check (true); -- Allow any insert, we'll validate the ID matches in the application

create policy "Enable update for users"
    on public.user_profiles
    for update
    using (auth.uid() = id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql security definer;

create trigger handle_updated_at
    before update on public.user_profiles
    for each row
    execute function public.handle_updated_at();

-- Grant access to authenticated users
grant usage on schema public to authenticated;
grant all on public.user_profiles to authenticated;

-- Create indexes for better performance
create index if not exists user_profiles_user_id_idx on public.user_profiles(id);
create index if not exists user_profiles_email_idx on public.user_profiles(email);
