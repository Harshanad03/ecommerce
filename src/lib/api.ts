import { supabase } from './supabase';
import { Product } from '@/types';

// Get all products
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data as Product[];
}

// Get featured products
export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true);
  
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  
  return data as Product[];
}

// Get product by ID
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
  
  return data as Product;
}

// Get products by category
export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
  
  return data as Product[];
}

// Add a new product
export async function addProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  
  if (error) {
    console.error('Error adding product:', error);
    return null;
  }
  
  return data[0] as Product;
}

// Update a product
export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    return null;
  }
  
  return data[0] as Product;
}

// Delete a product
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return false;
  }
  
  return true;
}
