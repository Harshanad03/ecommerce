'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };
    checkUser();
  }, [router]);

  const handleDeleteAccount = async () => {
    if (!isConfirmed) {
      setError('Please confirm that you want to delete your account');
      return;
    }

    if (!user) {
      setError('You must be logged in to delete your account');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First delete the user profile
      const { error: deleteProfileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id)
        .select()
        .single();

      if (deleteProfileError) {
        console.error('Delete profile error:', deleteProfileError);
        throw new Error('Failed to delete profile. Please try again.');
      }

      // Sign out the user
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Sign out error:', signOutError);
        throw new Error('Failed to sign out. Please try again.');
      }

      // Redirect to home page
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Delete Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
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

        <div className="mt-8 space-y-6">
          <div className="flex items-center">
            <input
              id="confirm-delete"
              name="confirm-delete"
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="confirm-delete" className="ml-2 block text-sm text-gray-900">
              I understand that this action cannot be undone
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isLoading || !isConfirmed}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 