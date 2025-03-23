"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '@/lib/api';
import { formatPrice } from '@/lib/utils.js';
import { categoriesData } from '@/data/productsData';
import ProductImageFallback from '@/components/ui/ProductImageFallback.js';
import { AdjustmentsHorizontalIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch all products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, sortOption]);
  
  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 1000 });
    setSortOption('featured');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
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
        <div className="pt-10 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">All Products</h1>
          <p className="mt-4 text-base text-gray-500">
            Browse our collection of high-quality products
          </p>
        </div>
        
        {/* Mobile filter dialog */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={toggleFilters}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div className="flex items-center">
            <label htmlFor="mobile-sort" className="sr-only">Sort by</label>
            <select
              id="mobile-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
        
        <div className="pt-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={toggleFilters}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="hidden lg:block">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="category-all"
                      name="category"
                      type="radio"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="category-all" className="ml-3 text-sm text-gray-600">
                      All Categories
                    </label>
                  </div>
                  
                  {categoriesData.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`category-${category.id}`}
                        name="category"
                        type="radio"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-600 capitalize">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <label htmlFor="min-price" className="block text-sm text-gray-500">Min Price</label>
                      <input
                        type="number"
                        id="min-price"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <label htmlFor="max-price" className="block text-sm text-gray-500">Max Price</label>
                      <input
                        type="number"
                        id="max-price"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
            
            {/* Product grid */}
            <div className="lg:col-span-3">
              {/* Desktop sorting options */}
              <div className="hidden lg:flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                  </span>
                </div>
                
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
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-2 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="group relative">
                      <div className="w-full h-60 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-75">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                          <p className="mt-1 text-sm text-gray-500 capitalize">{product.category}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
