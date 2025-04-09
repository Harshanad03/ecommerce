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
    using ( exists (
        select 1 from profiles 
        where id = auth.uid() and role = 'admin'
    ) );

-- Allow admins to update any profile
create policy "Admins can update any profile"
    on profiles for update
    using ( exists (
        select 1 from profiles 
        where id = auth.uid() and role = 'admin'
    ) );

-- Allow initial admin creation
create policy "Allow initial admin creation"
    on profiles for insert
    with check ( 
        not exists (select 1 from profiles where role = 'admin')
        or exists (
            select 1 from profiles 
            where id = auth.uid() and role = 'admin'
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


-- UPDATE profiles 
-- SET role = 'admin'
-- WHERE email = 'giriprasath234@gmail.com';  -- Replace with the user's email

-- UPDATE profiles 
-- SET role = 'admin'
-- WHERE id = '7d7e8e55-5ad0-4d30-8160-f370f5ceac17';  -- Replace with the user's ID