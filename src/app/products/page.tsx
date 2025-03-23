'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import ProductImageFallback from '@/components/ui/ProductImageFallback';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  subcategory_id: string;
  image_url: string;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading products: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">All Products</h1>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <AnimatedCard>
              <Link href={`/products/${product.id}`}>
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <ProductImageFallback category={product.category_id} />
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                    {product.stock > 0 ? (
                      <span className="text-sm text-green-600">In Stock</span>
                    ) : (
                      <span className="text-sm text-red-600">Out of Stock</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="mt-4">
                <AddToCartButton
                  product={product}
                  disabled={product.stock === 0}
                />
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
