-- Drop if exists
DROP TABLE IF EXISTS public.products;

-- Create products table
CREATE TABLE public.products (
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
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "products_select_policy" 
    ON products FOR SELECT 
    USING (true);

CREATE POLICY "products_insert_policy" 
    ON products FOR INSERT 
    WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "products_update_policy" 
    ON products FOR UPDATE 
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "products_delete_policy" 
    ON products FOR DELETE 
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Create index
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    new.updated_at = now();
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();