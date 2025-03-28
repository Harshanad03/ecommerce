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

// Refresh local products from storage
const refreshLocalProducts = () => {
  if (typeof window !== 'undefined') {
    localProducts = loadProductsFromStorage();
  }
};

// Get all products
export async function getAllProducts() {
  try {
    if (isSupabaseConfigured()) {
      // Create Supabase client if not already created
      if (!supabase) {
        supabase = createSupabaseClient();
      }
      
      // Fetch products directly from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products from Supabase:', error);
        // Fall back to localStorage
        return localProducts;
      }
      
      // Map the data to ensure compatibility with frontend
      const mappedProducts = data.map(product => ({
        ...product,
        image: product.image_url, // For compatibility with frontend
        stock: product.stock_quantity, // For compatibility with frontend
        rating: product.rating || 4.5,
        reviews: product.reviews || 0
      }));
      
      return mappedProducts;
    } else {
      // Use localStorage if Supabase is not configured
      return localProducts;
    }
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return localProducts;
  }
}

// Get featured products
export async function getFeaturedProducts() {
  try {
    if (isSupabaseConfigured()) {
      // Create Supabase client if not already created
      if (!supabase) {
        supabase = createSupabaseClient();
      }
      
      // Fetch featured products directly from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching featured products from Supabase:', error);
        // Fall back to localStorage
        return localProducts.filter(product => product.featured);
      }
      
      // Map the data to ensure compatibility with frontend
      const mappedProducts = data.map(product => ({
        ...product,
        image: product.image_url, // For compatibility with frontend
        stock: product.stock_quantity, // For compatibility with frontend
        rating: product.rating || 4.5,
        reviews: product.reviews || 0
      }));
      
      return mappedProducts;
    } else {
      // Use localStorage if Supabase is not configured
      return localProducts.filter(product => product.featured);
    }
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return localProducts.filter(product => product.featured);
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    if (isSupabaseConfigured()) {
      // Create Supabase client if not already created
      if (!supabase) {
        supabase = createSupabaseClient();
      }
      
      // Fetch product by ID directly from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching product with ID ${id} from Supabase:`, error);
        // Fall back to localStorage
        return localProducts.find(product => product.id === id) || null;
      }
      
      // Map the data to ensure compatibility with frontend
      const mappedProduct = {
        ...data,
        image: data.image_url, // For compatibility with frontend
        stock: data.stock_quantity, // For compatibility with frontend
        rating: data.rating || 4.5,
        reviews: data.reviews || 0
      };
      
      return mappedProduct;
    } else {
      // Use localStorage if Supabase is not configured
      return localProducts.find(product => product.id === id) || null;
    }
  } catch (error) {
    console.error(`Error in getProductById for ID ${id}:`, error);
    return localProducts.find(product => product.id === id) || null;
  }
}

// Get products by category
export async function getProductsByCategory(category) {
  try {
    if (isSupabaseConfigured()) {
      // Create Supabase client if not already created
      if (!supabase) {
        supabase = createSupabaseClient();
      }
      
      // Fetch products by category directly from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching products in category ${category} from Supabase:`, error);
        // Fall back to localStorage
        return localProducts.filter(product => product.category === category);
      }
      
      // Map the data to ensure compatibility with frontend
      const mappedProducts = data.map(product => ({
        ...product,
        image: product.image_url, // For compatibility with frontend
        stock: product.stock_quantity, // For compatibility with frontend
        rating: product.rating || 4.5,
        reviews: product.reviews || 0
      }));
      
      return mappedProducts;
    } else {
      // Use localStorage if Supabase is not configured
      return localProducts.filter(product => product.category === category);
    }
  } catch (error) {
    console.error(`Error in getProductsByCategory for category ${category}:`, error);
    return localProducts.filter(product => product.category === category);
  }
}

// Add a new product
export async function addProduct(product) {
  try {
    if (isSupabaseConfigured()) {
      // Create Supabase client if not already created
      if (!supabase) {
        supabase = createSupabaseClient();
      }
      
      // Create a complete product object with default values for missing fields
      const newId = String(Date.now());
      const newProduct = {
        ...product,
        id: newId,
        created_at: new Date().toISOString(),
        image: product.image_url, // For compatibility with frontend
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        stock: product.stock_quantity // For compatibility with frontend
      };
      
      // Try to save to Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();
      
      if (error) {
        console.error('Error adding product to Supabase:', error);
        console.log('Falling back to localStorage for product addition');
        
        // Save to localStorage as fallback
        localProducts.push(newProduct);
        saveProductsToStorage(localProducts);
        
        return newProduct;
      }
      
      // Also update localStorage to keep them in sync
      if (data && data.length > 0) {
        localProducts.push(data[0]);
        saveProductsToStorage(localProducts);
        return data[0];
      }
      
      return newProduct;
    } else {
      // Save to localStorage if Supabase is not configured
      const newId = String(Date.now());
      const newProduct = {
        ...product,
        id: newId,
        created_at: new Date().toISOString(),
        image: product.image_url, // For compatibility with frontend
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        stock: product.stock_quantity // For compatibility with frontend
      };
      
      localProducts.push(newProduct);
      saveProductsToStorage(localProducts);
      
      return newProduct;
    }
  } catch (error) {
    console.error('Error in addProduct:', error);
    
    // Always try to save to localStorage as a last resort
    const newId = String(Date.now());
    const newProduct = {
      ...product,
      id: newId,
      created_at: new Date().toISOString(),
      image: product.image_url, // For compatibility with frontend
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      stock: product.stock_quantity // For compatibility with frontend
    };
    
    localProducts.push(newProduct);
    saveProductsToStorage(localProducts);
    
    return newProduct;
  }
}

// Update a product
export async function updateProduct(productToUpdate) {
  try {
    if (isSupabaseConfigured()) {
      // Create Supabase client if not already created
      if (!supabase) {
        supabase = createSupabaseClient();
      }
      
      // Ensure the product has all required fields for frontend compatibility
      const updatedProduct = {
        ...productToUpdate,
        image: productToUpdate.image_url, // For compatibility with frontend
        stock: productToUpdate.stock_quantity, // For compatibility with frontend
        updated_at: new Date().toISOString()
      };
      
      // Try to update in Supabase
      const { data, error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', updatedProduct.id)
        .select();
      
      if (error) {
        console.error('Error updating product in Supabase:', error);
        console.log('Falling back to localStorage for product update');
        
        // Update in localStorage as fallback
        const index = localProducts.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          localProducts[index] = updatedProduct;
          saveProductsToStorage(localProducts);
        }
        
        return updatedProduct;
      }
      
      // Also update localStorage to keep them in sync
      if (data && data.length > 0) {
        const index = localProducts.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          localProducts[index] = data[0];
          saveProductsToStorage(localProducts);
        }
        return data[0];
      }
      
      return updatedProduct;
    } else {
      // Update in localStorage if Supabase is not configured
      const updatedProduct = {
        ...productToUpdate,
        image: productToUpdate.image_url, // For compatibility with frontend
        stock: productToUpdate.stock_quantity, // For compatibility with frontend
        updated_at: new Date().toISOString()
      };
      
      const index = localProducts.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        localProducts[index] = updatedProduct;
        saveProductsToStorage(localProducts);
      }
      
      return updatedProduct;
    }
  } catch (error) {
    console.error('Error in updateProduct:', error);
    
    // Always try to update localStorage as a last resort
    const updatedProduct = {
      ...productToUpdate,
      image: productToUpdate.image_url, // For compatibility with frontend
      stock: productToUpdate.stock_quantity, // For compatibility with frontend
      updated_at: new Date().toISOString()
    };
    
    const index = localProducts.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      localProducts[index] = updatedProduct;
      saveProductsToStorage(localProducts);
    }
    
    return updatedProduct;
  }
}

// Delete a product
export async function deleteProduct(id) {
  try {
    if (isSupabaseConfigured()) {
      // Create Supabase client if not already created
      if (!supabase) {
        supabase = createSupabaseClient();
      }
      
      // Try to delete from Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product from Supabase:', error);
        console.log('Falling back to localStorage for product deletion');
        
        // Delete from localStorage as fallback
        const filteredProducts = localProducts.filter(p => p.id !== id);
        saveProductsToStorage(filteredProducts);
        localProducts = filteredProducts;
        
        return { success: true };
      }
      
      // Also update localStorage to keep them in sync
      const filteredProducts = localProducts.filter(p => p.id !== id);
      saveProductsToStorage(filteredProducts);
      localProducts = filteredProducts;
      
      return { success: true };
    } else {
      // Delete from localStorage if Supabase is not configured
      const filteredProducts = localProducts.filter(p => p.id !== id);
      saveProductsToStorage(filteredProducts);
      localProducts = filteredProducts;
      
      return { success: true };
    }
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    
    // Always try to delete from localStorage as a last resort
    const filteredProducts = localProducts.filter(p => p.id !== id);
    saveProductsToStorage(filteredProducts);
    localProducts = filteredProducts;
    
    return { success: true };
  }
}
