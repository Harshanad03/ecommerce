import { productsData, saveProductsToStorage, loadProductsFromStorage } from '@/data/productsData';

// Function to initialize the localStorage with default products if it's empty
export function initializeProductsData() {
  if (typeof window !== 'undefined') {
    const storedProducts = localStorage.getItem('ecomz_products');
    
    // If no products in localStorage, initialize with default data
    if (!storedProducts) {
      console.log('Initializing products data in localStorage...');
      saveProductsToStorage(productsData);
      return true;
    }
    
    return false;
  }
  return false;
}
