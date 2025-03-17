import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/products';
import ProductImageFallback from '@/components/ui/ProductImageFallback';

export default function CategoriesPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shop by Category</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-3 aspect-h-2 bg-gray-200 relative h-64">
                <div className="h-full w-full flex items-center justify-center">
                  {category.image && category.image.startsWith('/') ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <ProductImageFallback category={category.id} className="h-full w-full" />
                  )}
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
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
