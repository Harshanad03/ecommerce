"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import ProductImageFallback from '@/components/ui/ProductImageFallback';
import { useParams } from 'next/navigation';

export default function SubCategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const subcategoryId = params.subcategoryId as string;
  
  // Find the current category and subcategory
  const category = categories.find(cat => cat.id === categoryId);
  const subcategory = category?.subcategories.find(subcat => subcat.id === subcategoryId);
  
  if (!category || !subcategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Subcategory Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">The subcategory you are looking for does not exist.</p>
        <Link href="/categories" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center mb-8">
          <Link href="/categories" className="text-indigo-600 hover:text-indigo-800 mr-2">
            Categories
          </Link>
          <span className="text-gray-500 mx-2">/</span>
          <Link href={`/categories/${category.id}`} className="text-indigo-600 hover:text-indigo-800 mr-2">
            {category.name}
          </Link>
          <span className="text-gray-500 mx-2">/</span>
          <h1 className="text-3xl font-extrabold text-gray-900">{subcategory.name}</h1>
        </div>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">{subcategory.description}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                {subcategory.image ? (
                  <Image
                    src={subcategory.image}
                    alt={subcategory.name}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <ProductImageFallback category={subcategory.id} className="h-full w-full" />
                )}
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop {subcategory.name}</h2>
              <p className="text-gray-600 mb-6">{subcategory.description}</p>
              <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                View All Products
              </div>
            </div>
          </div>
        </div>
        
        {/* Placeholder for products in this subcategory */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular in {subcategory.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-center text-gray-500 py-8">Product listings would appear here</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-center text-gray-500 py-8">Product listings would appear here</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-center text-gray-500 py-8">Product listings would appear here</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-center text-gray-500 py-8">Product listings would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
