'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { TrashIcon } from '@heroicons/react/24/outline';
import ProductImageFallback from '@/components/ui/ProductImageFallback';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.product.id} className="py-6 flex">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden relative">
                    <div className="h-full w-full flex items-center justify-center">
                      {item.product.image && item.product.image.startsWith('/') ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover object-center"
                        />
                      ) : (
                        <ProductImageFallback category={item.product.category} className="h-full w-full" />
                      )}
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link href={`/products/${item.product.id}`} className="hover:text-indigo-600">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="ml-4 text-lg font-medium text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                    </div>
                    
                    <div className="mt-4 flex-1 flex items-end justify-between">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.product.id}`} className="sr-only">
                          Quantity
                        </label>
                        <select
                          id={`quantity-${item.product.id}`}
                          name={`quantity-${item.product.id}`}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                          className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <span className="ml-4 text-sm font-medium text-gray-500">
                          ${item.product.price.toFixed(2)} each
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-sm font-medium text-gray-900">{formatPrice(getTotalPrice())}</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Shipping</div>
                  <div className="text-sm font-medium text-gray-900">Calculated at checkout</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Tax</div>
                  <div className="text-sm font-medium text-gray-900">Calculated at checkout</div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <div className="text-base font-medium text-gray-900">Order Total</div>
                  <div className="text-base font-medium text-gray-900">{formatPrice(getTotalPrice())}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
              
              <div className="mt-4">
                <Link
                  href="/products"
                  className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
