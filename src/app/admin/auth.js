"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// Create context
const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check if user has admin role in profiles table
  const checkIfUserIsAdmin = async (userId) => {
    try {
      console.log('Checking if user is admin:', userId);
      
      // Get user's profile from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return false;
      }

      // Check if user has admin role
      return profile?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is logged in and should be admin
    const checkAdminStatus = async () => {
      try {
        // Safely access localStorage (only available in browser)
        if (typeof window !== 'undefined') {
          const adminStatus = localStorage.getItem('ecomz-admin-logged-in');
          console.log('AdminProvider init - localStorage status:', adminStatus);
          
          if (adminStatus === 'true') {
            // Verify with Supabase that the user is still authenticated
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error || !user) {
              setIsAdmin(false);
              localStorage.removeItem('ecomz-admin-logged-in');
            } else {
              // Verify user has admin role
              const isUserAdmin = await checkIfUserIsAdmin(user.id);
              if (isUserAdmin) {
                setIsAdmin(true);
                setUser(user);
              } else {
                setIsAdmin(false);
                localStorage.removeItem('ecomz-admin-logged-in');
              }
            }
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        localStorage.removeItem('ecomz-admin-logged-in');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // First authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Authentication error:', error);
        return { success: false, message: error.message || 'Authentication failed' };
      }
      
      if (!data.user) {
        return { success: false, message: 'User not found' };
      }
      
      // Check if user has admin role
      const isUserAdmin = await checkIfUserIsAdmin(data.user.id);
      
      if (!isUserAdmin) {
        // User is authenticated but not an admin
        await supabase.auth.signOut();
        return { success: false, message: 'Access denied. Admin privileges required.' };
      }
      
      // User is authenticated and is an admin
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecomz-admin-logged-in', 'true');
      }
      setIsAdmin(true);
      setUser(data.user);
      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out, removing from localStorage');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ecomz-admin-logged-in');
      }
      
      setIsAdmin(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, loading, user }}>
      {children}
    </AdminContext.Provider>
  );
}

// Custom hook to use the admin context
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
