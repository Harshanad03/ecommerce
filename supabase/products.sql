-- Create products table
create table if not exists products (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    price decimal(10,2) not null,
    image_url text,
    category text,
    stock_quantity integer not null default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table products enable row level security;

-- Create policy for public read access
create policy "Allow public read access on products"
    on products for select
    using ( true );

-- Create policy for admin insert/update/delete
create policy "Allow admin full access to products"
    on products for all
    using ( auth.role() = 'admin' );

-- Function to automatically set updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at
create trigger set_products_updated_at
    before update on products
    for each row
    execute function set_updated_at();
