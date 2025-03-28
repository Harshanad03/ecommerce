"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon, TruckIcon, CreditCardIcon, ArrowRightIcon, StarIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "@/lib/utils.js";
import ProductImageFallback from "@/components/ui/ProductImageFallback.tsx";
import { categoriesData } from "@/data/productsData";
import { getAllProducts, getFeaturedProducts } from "@/lib/api";
import { initializeProductsData } from "@/lib/initializeData";

// Create a loading placeholder component
const LoadingPlaceholder = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-60 w-full"></div>
);

// Create optimized product card component
const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="group relative">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover object-center"
            onError={() => setImageError(true)}
            loading="lazy"
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
          <p className="mt-1 text-sm text-gray-500">{product.rating} ★ ({product.reviews || 0} reviews)</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Initialize products data in localStorage if needed
  useEffect(() => {
    const initialized = initializeProductsData();
    if (initialized) {
      console.log('Products data initialized in localStorage');
    }
  }, []);
  
  // Load products from our unified data source
  useEffect(() => {
    let isMounted = true;
    
    const loadProducts = async () => {
      try {
        // Load products in parallel for better performance
        const [allProducts, featured] = await Promise.all([
          getAllProducts(),
          getFeaturedProducts()
        ]);
        
        // Process products to ensure image_url is properly set
        const processedProducts = allProducts?.map(product => ({
          ...product,
          image_url: product.image_url || product.image || ''
        })) || [];
        
        const processedFeatured = featured?.map(product => ({
          ...product,
          image_url: product.image_url || product.image || ''
        })) || [];
        
        // Only update state if component is still mounted
        if (isMounted) {
          console.log('Loaded products:', processedProducts.length);
          console.log('Loaded featured products:', processedFeatured.length);
          setProducts(processedProducts);
          setFeaturedProducts(processedFeatured);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadProducts();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Memoize derived product lists to avoid unnecessary calculations on re-renders
  const newArrivals = products.slice(0, 4); // Reduced from 8 to 4 for faster initial load
  const bestSellers = products.length > 0 
    ? [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4) 
    : [];
  
  // Promotional images for the slider - use local images to avoid 404 errors
  const promotionalImages = [
    {
      src: "/images/promotions/winter-sale.svg",
      alt: "Winter Sale - Up to 70% Off",
    },
    {
      src: "/images/promotions/special-offer.svg",
      alt: "Special Offer - 50% Off Selected Items",
    },
    {
      src: "/images/promotions/new-arrivals.svg",
      alt: "New Arrivals - Fresh Collection",
    },
    {
      src: "/images/promotions/free-shipping.svg",
      alt: "Free Shipping on Orders Over $50",
    },
  ];
  
  // Effect to handle automatic slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotionalImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [promotionalImages.length]);

  // Handle manual navigation
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? promotionalImages.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotionalImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Full-width background slider */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {promotionalImages.map((image, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-full"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        
        {/* Slider Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button 
            onClick={goToPrevSlide}
            className="bg-white/80 p-2 rounded-r-md hover:bg-white focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button 
            onClick={goToNextSlide}
            className="bg-white/80 p-2 rounded-l-md hover:bg-white focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-800" />
          </button>
        </div>
        
        {/* Content - Button at absolute bottom */}
        <div className="relative h-[500px]">
          <div className="absolute bottom-0 left-0 right-0 bg-black/30 py-4">
            <div className="text-center">
              <Link href="/products" className="inline-block bg-white py-3 px-8 rounded-md font-medium text-indigo-600 hover:bg-indigo-50">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slider Navigation Dots - Moved below hero section */}
      <div className="flex justify-center space-x-2 py-4">
        {promotionalImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full focus:outline-none ${
              index === currentSlide ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Featured Products */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Products</h2>
            <Link href="/products?featured=true" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              View all <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 py-12">No featured products found.</p>
            )}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">New Arrivals</h2>
            <Link href="/products?sort=newest" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              View all <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 py-12">No products found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Best Sellers - Lazy load this section */}
      <Suspense fallback={
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Best Sellers</h2>
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <LoadingPlaceholder key={i} />
              ))}
            </div>
          </div>
        </div>
      }>
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Best Sellers</h2>
              <Link href="/products?sort=popular" className="text-indigo-600 hover:text-indigo-500 flex items-center">
                View all <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.length > 0 ? (
                bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="col-span-4 text-center text-gray-500 py-12">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </Suspense>

      {/* Shop by Category - Simplified version */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesData.slice(0, 4).map((category) => (
              <Link 
                key={category.id} 
                href={`/shop/category/${category.id}`}
                className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-64"
              >
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  <p className="text-sm text-white/80 mt-1">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center">Why Shop With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                <TruckIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-500">Free shipping on all orders over $50</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                <CreditCardIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-500">100% secure payment processing</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-500">If you're not satisfied, we'll refund you</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-500">Customer support available all day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
