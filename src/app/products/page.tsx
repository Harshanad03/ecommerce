'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
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
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
        
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-center object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    disabled={product.stock_quantity === 0}
                    className={`w-full py-2 px-4 rounded-md ${
                      product.stock_quantity > 0
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-300 cursor-not-allowed text-gray-500'
                    }`}
                  >
                    {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
