-- Create products table
create table products (
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
create policy "Allow public read access"
  on products for select
  using (true);

create policy "Allow authenticated users to create products"
  on products for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update their products"
  on products for update
  to authenticated
  using (true);

create policy "Allow authenticated users to delete their products"
  on products for delete
  to authenticated
  using (true);

-- Create function to automatically set updated_at on update
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically set updated_at on update
create trigger set_products_updated_at
  before update on products
  for each row
  execute function set_updated_at();

-- Create indexes
create index products_category_idx on products(category);
create index products_created_at_idx on products(created_at desc);
