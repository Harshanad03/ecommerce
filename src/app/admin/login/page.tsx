'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../auth';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dbInfo, setDbInfo] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const router = useRouter();
  const { login, isAdmin, loading: adminLoading } = useAdmin();

  // Use useEffect for redirection when isAdmin changes
  useEffect(() => {
    console.log('Login page - isAdmin state changed:', isAdmin);
    console.log('Login page - adminLoading state:', adminLoading);
    if (!adminLoading && isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, adminLoading, router]);

  // Direct database check function
  const checkDatabaseStructure = async () => {
    try {
      setDbInfo("Starting database structure check...");
      
      // 1. Check if we can get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        setDbInfo(`Auth error: ${userError.message}`);
        return;
      }
      
      if (!user) {
        setDbInfo("No authenticated user. Please log in first with any credentials.");
        return;
      }
      
      // 2. Try to get the list of tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        setDbInfo(`Error fetching tables: ${tablesError.message}`);
        return;
      }
      
      const tables = tablesData?.map(t => t.table_name) || [];
      const hasProfilesTable = tables.includes('profiles');
      
      // 3. Check profiles table columns
      let columnsInfo = "";
      if (hasProfilesTable) {
        const { data: columnsData, error: columnsError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type')
          .eq('table_schema', 'public')
          .eq('table_name', 'profiles');
        
        if (columnsError) {
          columnsInfo = `Error fetching columns: ${columnsError.message}`;
        } else {
          columnsInfo = `Columns in profiles table: ${JSON.stringify(columnsData)}`;
        }
      }
      
      // 4. Try direct insert to create a test profile
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id,
            role: 'admin',
            email: user.email
          }
        ])
        .select();
      
      let insertResult = "";
      if (insertError) {
        insertResult = `Insert error: ${insertError.message} (${insertError.code})`;
      } else {
        insertResult = `Insert result: ${JSON.stringify(insertData)}`;
      }
      
      // 5. Try direct select to read profiles
      const { data: selectData, error: selectError } = await supabase
        .from('profiles')
        .select('*');
      
      let selectResult = "";
      if (selectError) {
        selectResult = `Select error: ${selectError.message} (${selectError.code})`;
      } else {
        selectResult = `Found ${selectData?.length || 0} profiles`;
      }
      
      // Compile results
      setDbInfo(`
Database check results:

User: ${user.id} (${user.email})

Tables: ${tables.join(', ')}
Has profiles table: ${hasProfilesTable ? 'Yes' : 'No'}

${columnsInfo}

Direct insert attempt:
${insertResult}

Direct select attempt:
${selectResult}

If the profiles table exists but you're still getting errors, check:
1. Row Level Security policies on the profiles table
2. Exact column names (case-sensitive)
3. Table permissions for your user
      `);
      
    } catch (error) {
      setDbInfo(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const checkDatabaseColumns = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get full profile to check columns
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile for column check:', error);
          setDbInfo(`Error fetching profile: ${error.message} (${error.code})`);
          return;
        }
        
        if (data) {
          // Show available columns and their values
          const hasIsAdmin = 'is_admin' in data;
          const hasRole = 'role' in data;
          
          setDbInfo(`
            Profile columns found:
            ${hasIsAdmin ? `- is_admin: ${data.is_admin}` : '- is_admin: not found'}
            ${hasRole ? `- role: ${data.role}` : '- role: not found'}
            
            Full profile data:
            ${JSON.stringify(data, null, 2)}
          `);
          
          console.log('Profile data:', data);
        } else {
          setDbInfo('Profile not found for current user');
        }
      } else {
        setDbInfo('No authenticated user');
      }
    } catch (err) {
      console.error('Error in checkDatabaseColumns:', err);
      setDbInfo(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDbInfo(null);
    setLoading(true);

    try {
      // First attempt to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (!signInData.user) {
        throw new Error('No user returned from sign in');
      }

      // Log the user information
      console.log('User signed in:', signInData.user);

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();

      if (profileError) {
        console.log('Profile check error:', profileError);
        setDbInfo((prev) => `${prev}\nProfile check error: ${profileError.message}`);
      }

      // Check if the user has admin role
      if (!profile || profile.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Try to login with admin check
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        router.push('/admin');
      } else {
        throw new Error(result.message || 'Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Access denied. Admin privileges required.');
      setLoading(false);
    }
  };

  // Show loading state while checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If already logged in, show redirect message
  if (isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to admin dashboard...</p>
          {dbInfo && (
            <div className="mt-4 text-xs text-left bg-gray-100 p-3 rounded">
              <pre>{dbInfo}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="mb-8">
            <svg className="mx-auto h-16 w-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <div className="mt-8">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {dbInfo && (
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md overflow-auto max-h-60">
              <div className="flex">
                <div className="ml-3 w-full">
                  <p className="text-sm text-blue-700 whitespace-pre-line">{dbInfo}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white py-8 px-4 shadow-2xl rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    placeholder="your-email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in to Dashboard'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Protected admin area. Unauthorized access is prohibited.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Only users with admin privileges in the profiles table can access this area.
          </p>
          
          {showDebug ? (
            <div className="mt-4 space-y-2">
              <button
                onClick={checkDatabaseColumns}
                className="text-xs text-indigo-600 hover:text-indigo-500 mr-4"
              >
                Check Profile Structure
              </button>
              
              <button
                onClick={checkDatabaseStructure}
                className="text-xs text-indigo-600 hover:text-indigo-500"
              >
                Diagnose Database
              </button>
              
              <button
                onClick={() => setShowDebug(false)}
                className="block mx-auto mt-2 text-xs text-red-600 hover:text-red-500"
              >
                Hide Debug Tools
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDebug(true)}
              className="mt-4 text-xs text-gray-500 hover:text-gray-700"
            >
              Show Debug Tools
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
