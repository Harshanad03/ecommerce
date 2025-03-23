"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import ProductImageFallback from '@/components/ui/ProductImageFallback';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  
  // Find the current category
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Category Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">The category you are looking for does not exist.</p>
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
          <h1 className="text-3xl font-extrabold text-gray-900">{category.name}</h1>
        </div>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">{category.description}</p>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse {category.name} Subcategories</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={`/categories/${category.id}/${subcategory.id}`}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-3 aspect-h-2 bg-gray-200 relative h-48">
                <div className="h-full w-full flex items-center justify-center">
                  {subcategory.image && subcategory.image.startsWith('/') ? (
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
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{subcategory.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{subcategory.description}</p>
                <div className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Shop Now
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
