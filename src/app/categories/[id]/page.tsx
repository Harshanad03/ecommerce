import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products, categories } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import ProductImageFallback from '@/components/ui/ProductImageFallback';

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;
  
  const category = categories.find((cat) => cat.id === id);
  
  if (!category) {
    notFound();
  }
  
  const categoryProducts = products.filter((product) => product.category === id);
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <Link href="/categories" className="text-gray-500 hover:text-gray-700">
              Categories
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            <div className="w-full md:w-1/3 bg-gray-100 rounded-lg overflow-hidden relative h-64 mb-6 md:mb-0">
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
            
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{category.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{category.description}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">{categoryProducts.length}</span> products in this category
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products in {category.name}</h2>
          
          {categoryProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 relative h-64">
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
                      <p className="text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
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
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
