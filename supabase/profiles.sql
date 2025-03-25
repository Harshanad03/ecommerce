-- Create a table for public profiles
create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    email text,
    role text check (role in ('admin', 'user')) default 'user',
    created_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
-- Allow users to view their own profile
create policy "Users can view own profile"
    on profiles for select
    using ( auth.uid() = id );

-- Allow users to insert their own profile
create policy "Users can insert own profile"
    on profiles for insert
    with check ( auth.uid() = id );

-- Allow users to update their own profile (but not role)
create policy "Users can update own profile"
    on profiles for update
    using ( auth.uid() = id )
    with check ( auth.uid() = id and role = 'user' );

-- Allow admins to view all profiles
create policy "Admins can view all profiles"
    on profiles for select
    using (
        auth.uid() in (
            select id from profiles where role = 'admin'
        )
    );

-- Allow admins to update any profile's role
create policy "Admins can update any profile's role"
    on profiles for update
    using (
        auth.uid() in (
            select id from profiles where role = 'admin'
        )
    )
    with check (
        auth.uid() in (
            select id from profiles where role = 'admin'
        )
    );

-- Create a trigger to create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, role)
    values (new.id, new.email, 'user');
    return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
