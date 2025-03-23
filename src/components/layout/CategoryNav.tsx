"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  return (
    <div className="bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Main Categories */}
          <div className="flex justify-between items-center h-12">
            {categories.slice(0, 6).map((category) => (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => handleCategoryHover(category.id)}
              >
                <Link
                  href={`/categories/${category.id}`}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeCategory === category.id
                      ? 'text-indigo-600 font-semibold'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {category.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Subcategories Dropdown - Vertical Format */}
          {activeCategory && (
            <div
              className="absolute left-0 w-full bg-white shadow-lg rounded-b-md z-50 py-4"
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex px-6">
                {/* Category Image and Info */}
                <div className="w-1/4 pr-8 border-r border-gray-200">
                  <div className="relative h-40 w-full mb-4 overflow-hidden rounded-md">
                    {categories.find(cat => cat.id === activeCategory)?.image ? (
                      <Image
                        src={categories.find(cat => cat.id === activeCategory)?.image || ''}
                        alt={categories.find(cat => cat.id === activeCategory)?.name || ''}
                        fill
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">
                          {categories.find(cat => cat.id === activeCategory)?.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {categories.find(cat => cat.id === activeCategory)?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {categories.find(cat => cat.id === activeCategory)?.description}
                  </p>
                  <Link 
                    href={`/categories/${activeCategory}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View All
                  </Link>
                </div>
                
                {/* Vertical List of Subcategories */}
                <div className="w-3/4 pl-8">
                  <div className="grid grid-cols-3 gap-y-4">
                    {categories
                      .find((cat) => cat.id === activeCategory)
                      ?.subcategories.map((subcat) => (
                        <Link
                          key={subcat.id}
                          href={`/categories/${activeCategory}/${subcat.id}`}
                          className="group flex items-center p-2 rounded-md hover:bg-gray-50"
                        >
                          <div className="relative h-10 w-10 mr-3 overflow-hidden rounded-md">
                            {subcat.image ? (
                              <Image
                                src={subcat.image}
                                alt={subcat.name}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">{subcat.name[0]}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                            {subcat.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
