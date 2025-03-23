import { productsData, saveProductsToStorage, loadProductsFromStorage } from '@/data/productsData';

// Initialize products from storage or default data
let products = [];

// Initialize products when in browser environment
if (typeof window !== 'undefined') {
  // We'll load products in useEffect in components that need them
  products = loadProductsFromStorage();
} else {
  products = [...productsData];
}

// Get all products
export async function getAllProducts() {
  // Refresh from storage in case it was updated elsewhere
  if (typeof window !== 'undefined') {
    products = loadProductsFromStorage();
  }
  return [...products];
}

// Get featured products
export async function getFeaturedProducts() {
  // Refresh from storage
  if (typeof window !== 'undefined') {
    products = loadProductsFromStorage();
  }
  return products.filter(product => product.featured);
}

// Get product by ID
export async function getProductById(id) {
  // Refresh from storage
  if (typeof window !== 'undefined') {
    products = loadProductsFromStorage();
  }
  return products.find(product => product.id === id) || null;
}

// Get products by category
export async function getProductsByCategory(category) {
  // Refresh from storage
  if (typeof window !== 'undefined') {
    products = loadProductsFromStorage();
  }
  return products.filter(product => product.category === category);
}

// Add a new product
export async function addProduct(product) {
  try {
    // Generate a unique ID
    const newId = String(Date.now());
    
    const newProduct = {
      ...product,
      id: newId,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0
    };
    
    // Add to products array
    products.push(newProduct);
    
    // Save to storage
    saveProductsToStorage(products);
    
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
}

// Update a product
export async function updateProduct(productToUpdate) {
  try {
    const index = products.findIndex(p => p.id === productToUpdate.id);
    
    if (index === -1) {
      throw new Error(`Product with ID ${productToUpdate.id} not found`);
    }
    
    products[index] = {
      ...products[index],
      ...productToUpdate
    };
    
    // Save to storage
    saveProductsToStorage(products);
    
    return products[index];
  } catch (error) {
    console.error(`Error updating product:`, error);
    throw new Error('Failed to update product');
  }
}

// Delete a product
export async function deleteProduct(id) {
  try {
    const initialLength = products.length;
    products = products.filter(product => product.id !== id);
    
    // Save to storage
    saveProductsToStorage(products);
    
    return products.length !== initialLength;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw new Error('Failed to delete product');
  }
}
