'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
}

interface Profile {
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Get recent orders (placeholder data for now)
        // In a real app, you would fetch from your orders table
        setRecentOrders([
          {
            id: 'ORD-1234',
            created_at: new Date().toISOString(),
            status: 'delivered',
            total_amount: 125.99
          },
          {
            id: 'ORD-5678',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'processing',
            total_amount: 79.50
          },
          {
            id: 'ORD-9012',
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            total_amount: 45.75
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin animation-delay-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with 3D Effect */}
      <div className="p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="relative p-6 backdrop-blur-xl bg-white/90 rounded-xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full translate-x-20 -translate-y-20 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-full -translate-x-16 translate-y-16 opacity-70"></div>
          
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 shadow-lg flex items-center justify-center text-indigo-600 text-2xl sm:text-3xl font-bold border border-indigo-100/70 transform hover:rotate-3 transition-transform">
              {profile?.first_name?.charAt(0) || ''}{profile?.last_name?.charAt(0) || ''}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome, {profile?.first_name} {profile?.last_name}!
              </h2>
              <p className="text-gray-600 max-w-lg">
                Track your orders, manage your profile, and discover new products in your personalized dashboard.
              </p>
            </div>
            <div className="hidden sm:block sm:ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 p-px rounded-xl">
              <div className="px-6 py-3 bg-white rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-gray-800">$331.24</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto space-x-2 p-1">
        {['overview', 'orders', 'wishlist', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard Stats with 3D Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Orders Card */}
        <div className="rounded-2xl overflow-hidden group">
          <div className="p-px bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-600 rounded-2xl">
            <div className="bg-white rounded-2xl p-5 h-full transition-transform group-hover:translate-y-[-2px] group-hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold text-gray-900">{recentOrders.length}</h3>
                  <p className="text-sm text-gray-500">Orders</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">Last 30 days</div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">+12.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Card */}
        <div className="rounded-2xl overflow-hidden group">
          <div className="p-px bg-gradient-to-br from-purple-500 via-purple-400 to-purple-600 rounded-2xl">
            <div className="bg-white rounded-2xl p-5 h-full transition-transform group-hover:translate-y-[-2px] group-hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold text-gray-900">5</h3>
                  <p className="text-sm text-gray-500">Wishlist</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">Updated recently</div>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700">+2 new</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="rounded-2xl overflow-hidden group">
          <div className="p-px bg-gradient-to-br from-pink-500 via-pink-400 to-pink-600 rounded-2xl">
            <div className="bg-white rounded-2xl p-5 h-full transition-transform group-hover:translate-y-[-2px] group-hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-xl bg-pink-50 text-pink-600">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold text-gray-900">4.8</h3>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">12 reviews</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="rounded-2xl overflow-hidden group">
          <div className="p-px bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 rounded-2xl">
            <div className="bg-white rounded-2xl p-5 h-full transition-transform group-hover:translate-y-[-2px] group-hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold text-gray-900">$331.24</h3>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">Lifetime</div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">+18.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section with 3D Card */}
      <div className="rounded-2xl overflow-hidden">
        <div className="p-px bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link
                href="/dashboard/orders"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-medium">
                      <th scope="col" className="px-6 py-3 text-left rounded-l-lg">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left">Date</th>
                      <th scope="col" className="px-6 py-3 text-left">Status</th>
                      <th scope="col" className="px-6 py-3 text-right rounded-r-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            href={`/dashboard/orders/${order.id}`}
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            {order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                              order.status === 'delivered'
                                ? 'bg-green-600'
                                : order.status === 'processing'
                                  ? 'bg-yellow-600'
                                  : 'bg-gray-600'
                            }`}></span>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          ${order.total_amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                <div className="mt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Section with 3D Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Shop', href: '/', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'indigo' },
            { name: 'Orders', href: '/dashboard/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'purple' },
            { name: 'Profile', href: '/dashboard/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'pink' },
            { name: 'Settings', href: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'blue' }
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:translate-y-[-2px] text-center`}
            >
              <div className={`w-12 h-12 mb-3 rounded-xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 