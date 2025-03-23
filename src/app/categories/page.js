"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categoriesData } from '@/data/productsData';
import { getAllProducts } from '@/lib/api';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function CategoriesPage() {
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductCounts() {
      setLoading(true);
      try {
        const products = await getAllProducts();
        
        // Count products in each category
        const counts = {};
        products.forEach(product => {
          if (product.category) {
            counts[product.category] = (counts[product.category] || 0) + 1;
          }
        });
        
        setProductCounts(counts);
      } catch (error) {
        console.error('Error fetching product counts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProductCounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex py-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              <span className="ml-2 text-gray-900 font-medium">Categories</span>
            </li>
          </ol>
        </nav>
        
        {/* Header */}
        <div className="text-center py-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Product Categories
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Browse our products by category to find exactly what you're looking for
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="pb-24">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesData.map((category) => (
              <div key={category.id} className="group">
                <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                  <div className="relative h-80 w-full bg-gray-200 group-hover:opacity-75">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-center object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                        <span className="text-5xl font-bold text-indigo-600 capitalize">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                      <Link href={`/categories/${category.id}`}>
                        <span className="absolute inset-0" aria-hidden="true" />
                        {category.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {productCounts[category.id] || 0} products
                    </p>
                  </div>
                  <div>
                    <Link 
                      href={`/categories/${category.id}`}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      View category
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="relative py-16">
          <div className="bg-indigo-700 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to dive in?</span>
                  <span className="block">Browse all our products</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-200">
                  Discover our full collection of products across all categories.
                </p>
                <Link
                  href="/products"
                  className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  View All Products
                </Link>
              </div>
            </div>
            <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
              <div className="transform -translate-y-6 translate-x-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="h-full w-full text-indigo-100" fill="currentColor" viewBox="0 0 600 600" aria-hidden="true">
                    <path d="M121.6 175.5L103.5 201l18.1 25.5 18.1-25.5-18.1-25.5zm-7.2 49.3l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm-36.3-49.3l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5zm36.3 0l-18.1 25.5 18.1 25.5 18.1-25.5-18.1-25.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
