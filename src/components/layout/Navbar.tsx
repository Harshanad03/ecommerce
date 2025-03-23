"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";

const products = [
  { id: 1, name: "MacBook Pro", url: "/products/tshirt.jpeg" },
  { id: 2, name: "Samsung Galaxy S23", url: "/products/galaxy-s23" },
  { id: 3, name: "Casual Cotton T-Shirt", url: "/products/3" },
  { id: 4, name: "Sony Headphones", url: "/products/sony-headphones" },
];

const Navbar = () => {
  const cartItemCount = useCartStore((state) => state.getTotalItems());
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<{ id: number; name: string; url: string; }[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter products based on the search query
    if (query.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProducts(results);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              EcomZ
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/products" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                All Products
              </Link>
              <Link href="/categories" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Categories
              </Link>
              <Link href="/deals" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Deals
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search products..."
              type="search"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <div className="absolute bg-white shadow-lg rounded-md mt-1 w-64">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={product.url}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {product.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500">No results found</p>
                )}
              </div>
            )}
          </div>

          {/* Cart & Account Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="text-gray-500 hover:text-gray-900">
              <UserIcon className="h-6 w-6" aria-hidden="true" />
            </Link>
            <Link href="/cart" className="text-gray-500 hover:text-gray-900 relative">
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;