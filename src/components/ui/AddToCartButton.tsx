'use client';

import React, { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cart';
import { products } from '@/data/products';
import { motion } from 'framer-motion';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  showText?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  className = '',
  showText = true
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addItem(product);
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      className={`flex items-center justify-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${className}`}
      whileTap={{ scale: 0.95 }}
      animate={isAdding ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <ShoppingCartIcon className="h-5 w-5" />
      {showText && <span className="ml-2">Add to Cart</span>}
    </motion.button>
  );
};

export default AddToCartButton;
