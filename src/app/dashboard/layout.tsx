'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { supabase } from '@/lib/supabase';

// Dashboard Layout with 3D Modern Effects
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Redirect if not authenticated
      if (!session) {
        router.push('/profile');
        return;
      }
      
      // Redirect from /dashboard to /dashboard/profile
      if (pathname === '/dashboard') {
        router.push('/dashboard/profile');
      }
      
      // Get user profile data
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, role')
        .eq('id', session.user.id)
        .single();
        
      setUser({
        email: session.user.email,
        ...profile
      });
    };
    
    checkUser();
  }, [router, pathname]);

  const menuItems = [
    { name: 'Profile', href: '/dashboard/profile', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { name: 'Orders', href: '/dashboard/orders', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )},
    { name: 'Wishlist', href: '/dashboard/wishlist', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )},
    { name: 'Settings', href: '/dashboard/settings', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { name: 'Help', href: '/help', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-4 border-indigo-200 rounded-xl rotate-12 opacity-20"></div>
        <div className="absolute bottom-32 left-16 w-40 h-40 border-4 border-pink-200 rounded-full rotate-45 opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-4 border-purple-200 rotate-45 opacity-20"></div>
      </div>
      
      {/* Mobile menu */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-1 w-full max-w-xs">
                <div className="flex flex-col h-full overflow-y-auto bg-white backdrop-blur-xl bg-white/90 rounded-r-3xl shadow-2xl">
                  <div className="px-6 pt-5 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent text-2xl font-bold">E-Shop</span>
                      </div>
                      <button
                        type="button"
                        className="group -m-2.5 rounded-lg p-2 transition-all hover:bg-gray-100/50"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* User info */}
                  {user && (
                    <div className="flex items-center gap-3 mx-4 mt-2 mb-5 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium">
                        {user.first_name?.[0] || user.email?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.role || 'Customer'}
                        </p>
                      </div>
                      <button 
                        onClick={handleSignOut}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Sign out"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <nav className="flex-1 px-4 pb-4 space-y-1.5">
                    {menuItems.map((item) => {
                      const isActive = pathname?.startsWith(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                            {item.icon}
                          </span>
                          {item.name}
                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72">
        <div className="flex flex-col grow overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl rounded-r-3xl">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent text-2xl font-bold">E-Shop</span>
            </div>
            
            {/* User info */}
            {user && (
              <div className="flex items-center gap-3 m-4 mt-5 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/50">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md">
                  {user.first_name?.[0] || user.email?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role || 'Customer'}
                  </p>
                </div>
                <button 
                  onClick={handleSignOut} 
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Sign out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}

            <nav className="flex-1 px-4 pb-4 mt-5 space-y-1.5">
              {menuItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 text-indigo-600 shadow-sm'
                        : 'text-gray-700 hover:bg-indigo-50/50'
                    }`}
                  >
                    <span className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-10 flex items-center gap-x-6 bg-white/80 backdrop-blur-xl px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden rounded-lg hover:bg-gray-100/50 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">E-Shop</span>
        </div>
      </div>

      <main className="lg:pl-72">
        <div className="relative">
          {/* Main content wrapper with glassmorphism */}
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border border-gray-100/50 p-6 md:p-8 relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 z-0"></div>
              
              {/* Inner shadow for 3D effect */}
              <div className="absolute inset-0 shadow-inner rounded-3xl pointer-events-none z-0"></div>
              
              {/* Content container */}
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* CSS for blob animation */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// Add this to your global CSS
`
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes blob {
  0% {
    transform: scale(1) translate(0, 0);
  }
  33% {
    transform: scale(1.1) translate(30px, -50px);
  }
  66% {
    transform: scale(0.9) translate(-20px, 20px);
  }
  100% {
    transform: scale(1) translate(0, 0);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}
` 