import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          return set({
            items: items.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          });
        }
        
        set({ items: [...items, { product, quantity }] });
      },
      
      removeItem: (productId: string) => {
        const { items } = get();
        set({ items: items.filter(item => item.product.id !== productId) });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const { items } = get();
        
        if (quantity <= 0) {
          return get().removeItem(productId);
        }
        
        set({
          items: items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity } 
              : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
