"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SupabaseSetupPage() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [status, setStatus] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const router = useRouter();

  // Check if Supabase is already configured
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUrl = localStorage.getItem('supabase_url');
      const storedKey = localStorage.getItem('supabase_key');
      
      if (storedUrl && storedKey) {
        setSupabaseUrl(storedUrl);
        setSupabaseKey(storedKey);
        setIsConfigured(true);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Store in localStorage for our hybrid approach
      localStorage.setItem('supabase_url', supabaseUrl);
      localStorage.setItem('supabase_key', supabaseKey);
      
      setStatus('Supabase configuration saved successfully!');
      setIsConfigured(true);
      
      // Reload the page to apply the new configuration
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error saving Supabase configuration:', error);
      setStatus('Error saving configuration. Please try again.');
    }
  };

  const clearConfiguration = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase_url');
      localStorage.removeItem('supabase_key');
      setSupabaseUrl('');
      setSupabaseKey('');
      setIsConfigured(false);
      setStatus('Configuration cleared. You can enter new credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Supabase Configuration</h1>
            <p className="mt-2 text-gray-600">
              Configure your Supabase connection to enable database storage for your products
            </p>
          </div>

          {status && (
            <div className={`mb-6 p-4 rounded-md ${status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="supabaseUrl" className="block text-sm font-medium text-gray-700">
                Supabase URL
              </label>
              <input
                type="text"
                id="supabaseUrl"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://your-project.supabase.co"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Find this in your Supabase project settings under API
              </p>
            </div>

            <div>
              <label htmlFor="supabaseKey" className="block text-sm font-medium text-gray-700">
                Supabase Anon Key
              </label>
              <input
                type="text"
                id="supabaseKey"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your-anon-key"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Find this in your Supabase project settings under API
              </p>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Configuration
              </button>
              
              {isConfigured && (
                <button
                  type="button"
                  onClick={clearConfiguration}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Configuration
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900">How to Set Up Supabase</h2>
            <ol className="mt-4 space-y-4 text-sm text-gray-600 list-decimal list-inside">
              <li>
                <span className="font-medium">Create a Supabase account</span> at{' '}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                  supabase.com
                </a>
              </li>
              <li>
                <span className="font-medium">Create a new project</span> and note down your project URL and anon key
              </li>
              <li>
                <span className="font-medium">Create a 'products' table</span> with the following columns:
                <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                  <li>id (text, primary key)</li>
                  <li>name (text)</li>
                  <li>description (text)</li>
                  <li>price (numeric)</li>
                  <li>image (text)</li>
                  <li>category (text)</li>
                  <li>stock (integer)</li>
                  <li>featured (boolean)</li>
                  <li>rating (numeric, optional)</li>
                  <li>reviews (integer, optional)</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Enter your Supabase URL and anon key</span> in the form above
              </li>
            </ol>
          </div>

          <div className="mt-8 flex justify-center">
            <Link 
              href="/admin/products" 
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Return to Products Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
