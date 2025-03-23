"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import ProductImageFallback from '@/components/ui/ProductImageFallback';

export default function DealsPage() {
  // Filter products with a discount (for demo purposes, let's consider products with IDs that, when converted to numbers, are divisible by 3)
  const discountedProducts = products.filter(product => parseInt(product.id) % 3 === 0);

  // Create deal categories
  const dealCategories = [
    {
      id: 'flash-sale',
      name: 'Flash Sale',
      description: 'Limited time offers. Act fast!',
      discount: '50% OFF',
      color: 'from-red-600 to-orange-500',
      textColor: 'text-red-600',
      products: discountedProducts.slice(0, 4)
    },
    {
      id: 'clearance',
      name: 'Clearance',
      description: 'Last chance to buy',
      discount: 'Up to 70% OFF',
      color: 'from-purple-600 to-indigo-600',
      textColor: 'text-purple-600',
      products: discountedProducts.slice(4, 8)
    },
    {
      id: 'bundle-deals',
      name: 'Bundle Deals',
      description: 'Save more when you buy together',
      discount: 'Buy 2, Get 1 Free',
      color: 'from-green-600 to-teal-500',
      textColor: 'text-green-600',
      products: discountedProducts.slice(8, 12)
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-orange-500">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Special Deals & Offers
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-red-100">
            Discover incredible savings on your favorite products. Limited time offers you won't want to miss!
          </p>
          <div className="mt-10">
            <Link href="#deals" className="inline-block bg-white py-3 px-8 rounded-md font-medium text-red-600 hover:bg-red-50">
              View Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8 sm:p-10 sm:pb-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Flash Sale Ends In</h2>
              </div>
              <div className="mt-8 flex items-center justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-red-600">48</div>
                  <div className="text-sm text-gray-500">Hours</div>
                </div>
                <div className="text-4xl font-bold text-gray-300">:</div>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-red-600">23</div>
                  <div className="text-sm text-gray-500">Minutes</div>
                </div>
                <div className="text-4xl font-bold text-gray-300">:</div>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-red-600">59</div>
                  <div className="text-sm text-gray-500">Seconds</div>
                </div>
              </div>
            </div>
            <div className="px-6 pt-6 pb-8 bg-gray-50 sm:px-10">
              <p className="text-sm text-gray-500 text-center">
                Don't miss out on these limited-time offers. Shop now before they're gone!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Categories */}
      <div id="deals" className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        {dealCategories.map((category) => (
          <div key={category.id} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">{category.name}</h2>
                <p className="mt-2 text-lg text-gray-500">{category.description}</p>
              </div>
              <div className={`px-4 py-2 rounded-md font-bold ${category.textColor} bg-white shadow-sm border border-gray-200`}>
                {category.discount}
              </div>
            </div>
            
            <div className="relative">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color}`}></div>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.products.map((product) => (
                  <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 z-10 rounded-bl-lg font-medium">
                      SALE
                    </div>
                    <div className="aspect-w-3 aspect-h-4 bg-gray-200 relative h-80">
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
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link href={`/products/${product.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-medium text-gray-900">{formatPrice(product.price * 0.7)}</p>
                          <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <svg
                                key={rating}
                                className={`h-5 w-5 ${
                                  product.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 15.585l-7.07 3.707 1.35-7.857L.36 7.03l7.88-1.146L10 0l1.76 5.884 7.88 1.146-5.92 5.405 1.35 7.857z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}
                          </div>
                          <p className="ml-1 text-sm text-gray-500">({product.reviews})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href={`/categories/${category.id}`} className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r ${category.color} hover:opacity-90`}>
                  View All {category.name} Deals
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="rounded-lg bg-gradient-to-r from-red-600 to-orange-500 shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 lg:pl-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block">Want exclusive deals?</span>
                  <span className="block text-red-100">Sign up for our newsletter.</span>
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-red-100">
                  Be the first to know about special promotions, new arrivals, and exclusive offers.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
                <div className="sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input id="email" type="email" className="block w-full px-4 py-3 rounded-md border-0 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300" placeholder="Enter your email" />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button type="submit" className="block w-full py-3 px-4 rounded-md shadow bg-white text-red-600 font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300">
                      Subscribe
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-red-100">
                  We care about your data. Read our{' '}
                  <Link href="/privacy" className="font-medium text-white underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
