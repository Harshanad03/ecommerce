"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { categories } from '@/data/categories';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterPanelProps {
  onFilterChange?: (filters: {
    categories: string[];
    priceRange: [number, number];
  }) => void;
  minPrice?: number;
  maxPrice?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  minPrice = 0,
  maxPrice = 1000
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [minValue, setMinValue] = useState(minPrice);
  const [maxValue, setMaxValue] = useState(maxPrice);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close the filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        priceRange: [minValue, maxValue]
      });
    }
    setIsOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setMinValue(minPrice);
    setMaxValue(maxPrice);
    setPriceRange([minPrice, maxPrice]);
    
    if (onFilterChange) {
      onFilterChange({
        categories: [],
        priceRange: [minPrice, maxPrice]
      });
    }
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle min price change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinValue(value);
    if (value <= maxValue) {
      setPriceRange([value, maxValue]);
    }
  };

  // Handle max price change
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxValue(value);
    if (value >= minValue) {
      setPriceRange([minValue, value]);
    }
  };

  return (
    <div className="relative z-10 bg-white shadow-sm border-b" ref={filterRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <FunnelIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Filters</span>
            {(selectedCategories.length > 0 || minValue > minPrice || maxValue < maxPrice) && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Active
              </span>
            )}
          </button>
          
          <div className="flex items-center space-x-4">
            {(selectedCategories.length > 0 || minValue > minPrice || maxValue < maxPrice) && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-1">
                        <div className="flex items-center">
                          <input
                            id={`category-${category.id}`}
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {category.name}
                          </label>
                        </div>
                        
                        {/* Subcategories */}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="flex items-center">
                                <input
                                  id={`subcategory-${subcategory.id}`}
                                  type="checkbox"
                                  checked={selectedCategories.includes(subcategory.id)}
                                  onChange={() => toggleCategory(subcategory.id)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`subcategory-${subcategory.id}`}
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  {subcategory.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-1/2">
                        <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">
                          Min Price
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="min-price"
                            value={minValue}
                            onChange={handleMinPriceChange}
                            min={minPrice}
                            max={maxPrice}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="w-1/2">
                        <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">
                          Max Price
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="max-price"
                            value={maxValue}
                            onChange={handleMaxPriceChange}
                            min={minPrice}
                            max={maxPrice}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 px-2">
                      <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="absolute h-2 bg-indigo-600 rounded-full"
                            style={{
                              left: `${((minValue - minPrice) / (maxPrice - minPrice)) * 100}%`,
                              right: `${100 - ((maxValue - minPrice) / (maxPrice - minPrice)) * 100}%`
                            }}
                          ></div>
                        </div>
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          value={minValue}
                          onChange={handleMinPriceChange}
                          className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none"
                          style={{ zIndex: 2 }}
                        />
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          value={maxValue}
                          onChange={handleMaxPriceChange}
                          className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent pointer-events-none"
                          style={{ zIndex: 2 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={applyFilters}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
