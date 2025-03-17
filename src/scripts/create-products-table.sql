-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  rating NUMERIC,
  reviews INTEGER,
  stock INTEGER NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured) WHERE featured = true;

-- Add a comment to the table
COMMENT ON TABLE products IS 'Stores all product information for the ecomz store';

-- Sample query to verify the table structure
-- SELECT * FROM products LIMIT 10;

-- Sample query to count featured products
-- SELECT COUNT(*) FROM products WHERE featured = true;
