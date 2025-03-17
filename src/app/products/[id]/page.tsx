'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import ProductImageFallback from '@/components/ui/ProductImageFallback';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(state => state.addItem);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you are looking for does not exist.</p>
        <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="flex mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-500 mx-2">/</span>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-900">
                Products
              </Link>
            </li>
            <li>
              <span className="text-gray-500 mx-2">/</span>
            </li>
            <li>
              <Link href={`/categories/${product.category}`} className="text-gray-500 hover:text-gray-900">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Link>
            </li>
            <li>
              <span className="text-gray-500 mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden relative h-96 lg:h-[600px]">
            <div className="h-full w-full flex items-center justify-center">
              {product.image && product.image.startsWith('/') ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <ProductImageFallback category={product.category} className="h-full w-full" />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
            
            {/* Rating */}
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <span key={rating}>
                    {product.rating > rating ? (
                      <StarIconSolid className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <StarIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </span>
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-600">{product.reviews} reviews</p>
            </div>
            
            {/* Price */}
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
              <p className="mt-1 text-sm text-gray-500">Price includes taxes and shipping</p>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <div className="mt-2 text-base text-gray-700 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>
            
            {/* Stock */}
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Availability: 
                <span className={`ml-1 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </p>
            </div>
            
            {/* Quantity */}
            <div className="mt-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="mt-1 flex items-center">
                <button
                  type="button"
                  className="p-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="p-2 w-16 text-center border-t border-b border-gray-300 text-gray-900"
                />
                <button
                  type="button"
                  className="p-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <div className="mt-8 flex space-x-4">
              <button
                type="button"
                className="flex-1 bg-indigo-600 text-white py-3 px-8 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button
                type="button"
                className="p-3 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50"
              >
                <HeartIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Shipping</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Free shipping on orders over $50. Delivery within 3-5 business days.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Returns</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    30-day return policy. See our return policy for more details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 relative h-64">
                    <div className="h-full w-full flex items-center justify-center">
                      {relatedProduct.image && relatedProduct.image.startsWith('/') ? (
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover object-center"
                        />
                      ) : (
                        <ProductImageFallback category={relatedProduct.category} className="h-full w-full" />
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link href={`/products/${relatedProduct.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {relatedProduct.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{relatedProduct.category}</p>
                    <p className="mt-2 text-sm font-medium text-gray-900">{formatPrice(relatedProduct.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
