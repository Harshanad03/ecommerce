"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '@/lib/api';
import { formatPrice } from '@/lib/utils.js';
import { categoriesData } from '@/data/productsData';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Mock subcategories data - in a real app, this would come from your API or database
const subcategoriesData = {
  electronics: [
    { id: 'smartphones', name: 'Smartphones', description: 'Latest smartphones and mobile devices' },
    { id: 'audio', name: 'Audio', description: 'Headphones, speakers, and audio equipment' },
    { id: 'computers', name: 'Computers', description: 'Laptops, desktops, and computer accessories' },
    { id: 'wearables', name: 'Wearables', description: 'Smartwatches and fitness trackers' }
  ],
  clothing: [
    { id: 'mens', name: 'Men\'s Clothing', description: 'Shirts, pants, and accessories for men' },
    { id: 'womens', name: 'Women\'s Clothing', description: 'Dresses, tops, and accessories for women' },
    { id: 'kids', name: 'Kids\' Clothing', description: 'Clothing for children and teenagers' }
  ],
  furniture: [
    { id: 'living-room', name: 'Living Room', description: 'Sofas, coffee tables, and living room furniture' },
    { id: 'bedroom', name: 'Bedroom', description: 'Beds, dressers, and bedroom furniture' },
    { id: 'office', name: 'Office', description: 'Desks, chairs, and office furniture' }
  ],
  accessories: [
    { id: 'bags', name: 'Bags', description: 'Backpacks, handbags, and luggage' },
    { id: 'jewelry', name: 'Jewelry', description: 'Necklaces, rings, and other jewelry' },
    { id: 'watches', name: 'Watches', description: 'Analog and digital watches' }
  ]
};

export default function SubcategoryPage({ params }) {
  const { categoryId, subcategoryId } = params;
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  
  // Fetch category, subcategory info and products
  useEffect(() => {
    async function fetchSubcategoryProducts() {
      setLoading(true);
      try {
        // Find category info
        const categoryInfo = categoriesData.find(cat => cat.id === categoryId);
        setCategory(categoryInfo);
        
        // Find subcategory info
        const subcategories = subcategoriesData[categoryId] || [];
        const subcategoryInfo = subcategories.find(sub => sub.id === subcategoryId);
        setSubcategory(subcategoryInfo);
        
        // Fetch all products and filter by category
        // In a real app, you would have a dedicated API endpoint for this
        const allProducts = await getAllProducts();
        
        // Filter products that match both category and subcategory
        // This is a simplified approach - in a real app, products would have a subcategory field
        const filteredProducts = allProducts.filter(product => 
          product.category === categoryId && 
          (product.name.toLowerCase().includes(subcategoryId) || 
           product.description.toLowerCase().includes(subcategoryId))
        );
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching subcategory products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubcategoryProducts();
  }, [categoryId, subcategoryId]);
  
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
  
  if (!category || !subcategory) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Subcategory Not Found</h1>
        <p className="text-gray-600 mb-6">The subcategory you're looking for doesn't exist.</p>
        <Link href={`/categories/${categoryId}`} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Back to {category ? category.name : 'Category'}
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
              <Link href="/categories" className="ml-2 text-gray-500 hover:text-gray-700">Categories</Link>
            </li>
            <li className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              <Link href={`/categories/${categoryId}`} className="ml-2 text-gray-500 hover:text-gray-700 capitalize">
                {category.name}
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              <span className="ml-2 text-gray-900 font-medium capitalize">{subcategory.name}</span>
            </li>
          </ol>
        </nav>
        
        {/* Subcategory Header */}
        <div className="relative py-16 bg-gray-50 overflow-hidden rounded-lg mb-8">
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 capitalize">
                {subcategory.name}
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                {subcategory.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="pb-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'}
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
              <h3 className="text-lg font-medium text-gray-900">No products found in this subcategory</h3>
              <p className="mt-2 text-sm text-gray-500">Check back later for new products or browse other subcategories.</p>
              <Link 
                href={`/categories/${categoryId}`} 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to {category.name}
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
        
        {/* Other Subcategories */}
        <div className="border-t border-gray-200 pt-12 pb-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Browse Other Subcategories</h2>
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {(subcategoriesData[categoryId] || [])
              .filter(sub => sub.id !== subcategoryId)
              .map((sub) => (
                <Link 
                  key={sub.id} 
                  href={`/categories/${categoryId}/${sub.id}`}
                  className="group block rounded-lg overflow-hidden hover:bg-gray-50"
                >
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-700 text-lg font-medium capitalize">{sub.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900 capitalize">{sub.name}</p>
                      <p className="text-sm text-gray-500 truncate">{sub.description}</p>
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
