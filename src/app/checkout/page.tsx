'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would process the payment here
    // and send the order to your backend
    setOrderPlaced(true);
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">You need to add items to your cart before checking out.</p>
        <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Browse Products
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. We've sent a confirmation email to {formData.email}.
          </p>
          <p className="text-gray-600 mb-8">
            Your order number is: <span className="font-medium">#EZ{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
          </p>
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      id="credit-card"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="credit-card" className="text-sm font-medium text-gray-700">
                      Credit Card
                    </label>
                  </div>
                  
                  {formData.paymentMethod === 'credit-card' && (
                    <div className="pl-8 space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          required
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            id="cardCvc"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            placeholder="123"
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="paypal" className="text-sm font-medium text-gray-700">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.product.id} className="py-4 flex">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover object-center"
                          />
                        ) : (
                          <span>No image</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="ml-4 text-sm font-medium text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-sm font-medium text-gray-900">{formatPrice(getTotalPrice())}</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Shipping</div>
                  <div className="text-sm font-medium text-gray-900">Free</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Tax (10%)</div>
                  <div className="text-sm font-medium text-gray-900">{formatPrice(getTotalPrice() * 0.1)}</div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <div className="text-base font-medium text-gray-900">Order Total</div>
                  <div className="text-base font-medium text-gray-900">{formatPrice(getTotalPrice() * 1.1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
