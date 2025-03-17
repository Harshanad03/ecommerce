// src/app/products/page.tsx (Client Component)
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import ProductImageFallback from '@/components/ui/ProductImageFallback';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1 
          className="text-3xl font-extrabold text-gray-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          All Products
        </motion.h1>
        
        {/* Product Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => (
            <AnimatedCard key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 relative h-80">
                <div className="h-full w-full flex items-center justify-center">
                  {product.image && product.image.startsWith('/') ? (
                    <Image src={product.image} alt={product.name} fill className="object-cover object-center" />
                  ) : (
                    <ProductImageFallback category={product.category} className="h-full w-full" />
                  )}
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <AddToCartButton product={product} className="p-2 rounded-full" showText={false} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link href={`/products/${product.id}`} className="hover:text-indigo-600 transition-colors">
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                <p className="text-lg font-medium text-gray-900 mt-2">{formatPrice(product.price)}</p>
              </div>
            </AnimatedCard>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
