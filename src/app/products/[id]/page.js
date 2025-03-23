"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/solid';
import { getProductById, getProductsByCategory } from '@/lib/api';
import { formatPrice } from '@/lib/utils.js';
import ProductImageFallback from '@/components/ui/ProductImageFallback';

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Load related products from the same category
        if (productData?.category) {
          const categoryProducts = await getProductsByCategory(productData.category);
          // Filter out the current product and limit to 4 related products
          const related = categoryProducts
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link href={`/categories/${product.category}`} className="text-gray-500 hover:text-gray-700 capitalize">
                {product.category}
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Image */}
          <div className="relative h-96 rounded-lg overflow-hidden bg-gray-100">
            {product.image ? (
              <Image 
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="w-full h-full">
                <ProductImageFallback category={product.category} />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">{formatPrice(product.price)}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={`${
                        product.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                      } h-5 w-5 flex-shrink-0`}
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-500">
                  {product.reviews} reviews
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-gray-700">{product.description}</p>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <div className={`rounded-full h-4 w-4 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="ml-2 text-sm font-medium text-gray-700">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <div className="flex items-center">
                <span className="mr-3 text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={decrementQuantity}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-12 text-center border-0 focus:ring-0"
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={product.stock <= 0}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button
                type="button"
                className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
                Add to Wishlist
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Category: <span className="capitalize">{product.category}</span></li>
                  <li>Product ID: {product.id}</li>
                  {product.featured && <li>Featured Product</li>}
                  <li>Rating: {product.rating} out of 5</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Related Products</h2>
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group relative">
                  <div className="w-full h-60 bg-gray-200 rounded-md overflow-hidden group-hover:opacity-75">
                    {relatedProduct.image ? (
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <ProductImageFallback category={relatedProduct.category} />
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link href={`/products/${relatedProduct.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {relatedProduct.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 capitalize">{relatedProduct.category}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(relatedProduct.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
