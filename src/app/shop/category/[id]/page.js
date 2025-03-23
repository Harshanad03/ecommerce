"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductsByCategory } from '@/lib/api';
import { formatPrice } from '@/lib/utils.js';
import { categoriesData } from '@/data/productsData';
import ProductImageFallback from '@/components/ui/ProductImageFallback';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function CategoryPage({ params }) {
  const { id: categoryId } = params;
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  
  // Fetch category info and products
  useEffect(() => {
    async function fetchCategoryProducts() {
      setLoading(true);
      try {
        // Find category info
        const categoryInfo = categoriesData.find(cat => cat.id === categoryId);
        setCategory(categoryInfo);
        
        // Fetch products for this category
        const categoryProducts = await getProductsByCategory(categoryId);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategoryProducts();
  }, [categoryId]);
  
  // Apply sorting
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'rating':
        return b.rating - a.rating;
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
        <Link href="/products" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Browse All Products
        </Link>
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
              <Link href="/shop/categories" className="ml-2 text-gray-500 hover:text-gray-700">Categories</Link>
            </li>
            <li className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              <span className="ml-2 text-gray-900 font-medium capitalize">{category.name}</span>
            </li>
          </ol>
        </nav>
        
        {/* Category Header */}
        <div className="relative py-16 bg-gray-50 overflow-hidden rounded-lg mb-8">
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 capitalize">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                {category.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="pb-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </h2>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
          
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No products found in this category</h3>
              <p className="mt-2 text-sm text-gray-500">Check back later for new products or browse other categories.</p>
              <Link 
                href="/products" 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="w-full h-60 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-75">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <ProductImageFallback category={product.category} />
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link href={`/products/${product.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.rating} ★ ({product.reviews} reviews)</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
                  </div>
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Other Categories */}
        <div className="border-t border-gray-200 pt-12 pb-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Browse Other Categories</h2>
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesData
              .filter(cat => cat.id !== categoryId)
              .map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/shop/category/${cat.id}`}
                  className="group block rounded-lg overflow-hidden hover:bg-gray-50"
                >
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-700 text-lg font-medium capitalize">{cat.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900 capitalize">{cat.name}</p>
                      <p className="text-sm text-gray-500 truncate">{cat.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
