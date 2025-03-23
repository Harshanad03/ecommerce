"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import ProductImageFallback from '@/components/ui/ProductImageFallback';
import { useParams } from 'next/navigation';

export default function SubCategoryPage() {
  const params = useParams();
  
  // Add console logs for debugging
  console.log('Params:', params);
  console.log('Available categories:', categories);
  
  const categoryId = params?.categoryId as string;
  const subcategoryId = params?.subcategoryId as string;
  
  // Validate params
  if (!categoryId || !subcategoryId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold text-red-600">Error: Missing category or subcategory ID</h1>
        <Link href="/categories" className="text-blue-600 hover:underline">
          Return to Categories
        </Link>
      </div>
    );
  }
  
  // Find the current category and subcategory
  const category = categories.find(cat => cat.id === categoryId);
  const subcategory = category?.subcategories?.find(subcat => subcat.id === subcategoryId);
  
  // Add more detailed error handling
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold text-red-600">Category not found</h1>
        <p className="mt-2">Could not find category with ID: {categoryId}</p>
        <Link href="/categories" className="text-blue-600 hover:underline">
          Return to Categories
        </Link>
      </div>
    );
  }

  if (!subcategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold text-red-600">Subcategory not found</h1>
        <p className="mt-2">Could not find subcategory with ID: {subcategoryId} in category: {category.name}</p>
        <Link href={`/categories/${categoryId}`} className="text-blue-600 hover:underline">
          Return to {category.name}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <nav className="mb-8">
        <ol className="flex space-x-2 text-sm">
          <li>
            <Link href="/categories" className="text-gray-500 hover:text-gray-700">
              Categories
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href={`/categories/${categoryId}`} className="text-gray-500 hover:text-gray-700">
              {category.name}
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-900">{subcategory.name}</li>
        </ol>
      </nav>

      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{subcategory.name}</h1>
          <p className="mt-4 text-gray-600">{subcategory.description}</p>
        </div>

        {subcategory.image && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={subcategory.image}
              alt={subcategory.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
