import { createClient } from '@supabase/supabase-js';
import { productsData, saveProductsToStorage, loadProductsFromStorage } from '@/data/productsData';

// Function to get Supabase credentials from localStorage
const getSupabaseCredentials = () => {
  if (typeof window !== 'undefined') {
    const supabaseUrl = localStorage.getItem('supabase_url');
    const supabaseKey = localStorage.getItem('supabase_key');
    return { supabaseUrl, supabaseKey };
  }
  return { supabaseUrl: '', supabaseKey: '' };
};

// Initialize Supabase client with credentials from localStorage
const createSupabaseClient = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseCredentials();
  
  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }
  return null;
};

// Get Supabase client (will be null if not configured)
let supabase = null;

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  if (typeof window !== 'undefined') {
    const { supabaseUrl, supabaseKey } = getSupabaseCredentials();
    
    // Update the supabase client with the latest credentials
    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
      return true;
    }
  }
  return false;
};

// Initialize products from storage
let localProducts = [];
if (typeof window !== 'undefined') {
  localProducts = loadProductsFromStorage();
  
  // Log Supabase configuration status
  console.log('Checking Supabase configuration...');
  const isConfigured = isSupabaseConfigured();
  console.log('Supabase configured:', isConfigured);
  if (!isConfigured) {
    console.warn('Supabase is not configured. Using localStorage fallback.');
    console.log('To configure Supabase, visit the /admin/setup page.');
  }
}

// Get all products
export async function getAllProducts() {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products from Supabase:', error);
        // Fall back to local storage
        return typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
      }
      
      return data;
    } else {
      // Use localStorage if Supabase is not configured
      return typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
    }
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
  }
}

// Get featured products
export async function getFeaturedProducts() {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true);
      
      if (error) {
        console.error('Error fetching featured products from Supabase:', error);
        // Fall back to local storage
        const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
        return products.filter(product => product.featured);
      }
      
      return data;
    } else {
      // Use localStorage if Supabase is not configured
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
      return products.filter(product => product.featured);
    }
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
    return products.filter(product => product.featured);
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching product with ID ${id} from Supabase:`, error);
        // Fall back to local storage
        const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
        return products.find(product => product.id === id) || null;
      }
      
      return data;
    } else {
      // Use localStorage if Supabase is not configured
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
      return products.find(product => product.id === id) || null;
    }
  } catch (error) {
    console.error(`Error in getProductById for ID ${id}:`, error);
    const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
    return products.find(product => product.id === id) || null;
  }
}

// Get products by category
export async function getProductsByCategory(category) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);
      
      if (error) {
        console.error(`Error fetching products in category ${category} from Supabase:`, error);
        // Fall back to local storage
        const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
        return products.filter(product => product.category === category);
      }
      
      return data;
    } else {
      // Use localStorage if Supabase is not configured
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
      return products.filter(product => product.category === category);
    }
  } catch (error) {
    console.error(`Error in getProductsByCategory for category ${category}:`, error);
    const products = typeof window !== 'undefined' ? loadProductsFromStorage() : localProducts;
    return products.filter(product => product.category === category);
  }
}

// Add a new product
export async function addProduct(product) {
  try {
    // Always save to localStorage as a backup
    const newId = String(Date.now());
    const newProduct = {
      ...product,
      id: newId,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0
    };
    
    if (isSupabaseConfigured()) {
      // Try to save to Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();
      
      if (error) {
        console.error('Error adding product to Supabase:', error);
        console.log('Falling back to localStorage for product addition');
        
        // Save to localStorage as fallback
        const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
        products.push(newProduct);
        saveProductsToStorage(products);
        localProducts = products;
        
        return newProduct;
      }
      
      // Also update localStorage to keep them in sync
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
      products.push(data[0]);
      saveProductsToStorage(products);
      localProducts = products;
      
      return data[0];
    } else {
      // Save to localStorage if Supabase is not configured
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
      products.push(newProduct);
      saveProductsToStorage(products);
      localProducts = products;
      
      return newProduct;
    }
  } catch (error) {
    console.error('Error in addProduct:', error);
    
    // Always try to save to localStorage as a last resort
    const newId = String(Date.now());
    const newProduct = {
      ...product,
      id: newId,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0
    };
    
    const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
    products.push(newProduct);
    saveProductsToStorage(products);
    localProducts = products;
    
    return newProduct;
  }
}

// Update a product
export async function updateProduct(productToUpdate) {
  try {
    const id = productToUpdate.id;
    
    if (isSupabaseConfigured()) {
      // Try to update in Supabase
      const { data, error } = await supabase
        .from('products')
        .update(productToUpdate)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`Error updating product with ID ${id} in Supabase:`, error);
        console.log('Falling back to localStorage for product update');
        
        // Update in localStorage as fallback
        const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
          products[index] = { ...products[index], ...productToUpdate };
          saveProductsToStorage(products);
          localProducts = products;
          return products[index];
        }
        
        return null;
      }
      
      // Also update localStorage to keep them in sync
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
      const index = products.findIndex(p => p.id === id);
      
      if (index !== -1) {
        products[index] = data[0];
        saveProductsToStorage(products);
        localProducts = products;
      }
      
      return data[0];
    } else {
      // Update in localStorage if Supabase is not configured
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
      const index = products.findIndex(p => p.id === id);
      
      if (index !== -1) {
        products[index] = { ...products[index], ...productToUpdate };
        saveProductsToStorage(products);
        localProducts = products;
        return products[index];
      }
      
      return null;
    }
  } catch (error) {
    console.error(`Error in updateProduct for ID ${productToUpdate.id}:`, error);
    
    // Always try to update localStorage as a last resort
    const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
    const index = products.findIndex(p => p.id === productToUpdate.id);
    
    if (index !== -1) {
      products[index] = { ...products[index], ...productToUpdate };
      saveProductsToStorage(products);
      localProducts = products;
      return products[index];
    }
    
    return null;
  }
}

// Delete a product
export async function deleteProduct(id) {
  try {
    if (isSupabaseConfigured()) {
      // Try to delete from Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting product with ID ${id} from Supabase:`, error);
        console.log('Falling back to localStorage for product deletion');
        
        // Delete from localStorage as fallback
        const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
        const filteredProducts = products.filter(product => product.id !== id);
        saveProductsToStorage(filteredProducts);
        localProducts = filteredProducts;
        
        return true;
      }
      
      // Also update localStorage to keep them in sync
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
      const filteredProducts = products.filter(product => product.id !== id);
      saveProductsToStorage(filteredProducts);
      localProducts = filteredProducts;
      
      return true;
    } else {
      // Delete from localStorage if Supabase is not configured
      const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
      const filteredProducts = products.filter(product => product.id !== id);
      saveProductsToStorage(filteredProducts);
      localProducts = filteredProducts;
      
      return true;
    }
  } catch (error) {
    console.error(`Error in deleteProduct for ID ${id}:`, error);
    
    // Always try to delete from localStorage as a last resort
    const products = typeof window !== 'undefined' ? loadProductsFromStorage() : [...localProducts];
    const filteredProducts = products.filter(product => product.id !== id);
    saveProductsToStorage(filteredProducts);
    localProducts = filteredProducts;
    
    return true;
  }
}
