-- Create products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null check (price >= 0),
  image_url text,
  category text not null,
  stock_quantity integer not null check (stock_quantity >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;

-- Create policies
create policy "Allow public read access" on products
  for select using (true);

create policy "Allow admin insert" on products
  for insert with check (auth.role() = 'authenticated');

create policy "Allow admin update" on products
  for update using (auth.role() = 'authenticated');

create policy "Allow admin delete" on products
  for delete using (auth.role() = 'authenticated');

-- Create function to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

-- Create storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- Create storage policy to allow public access to product images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- Create storage policy to allow authenticated users to upload images
create policy "Allow authenticated upload"
on storage.objects for insert
with check ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
