"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// Create context
const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount with proper error handling
    try {
      // Safely access localStorage (only available in browser)
      if (typeof window !== 'undefined') {
        const adminStatus = localStorage.getItem('ecomz-admin-logged-in');
        setIsAdmin(adminStatus === 'true');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } finally {
      // Always set loading to false, even if there was an error
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    // Trim inputs and make email case-insensitive
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    console.log(`Login attempt: ${cleanEmail}`);
    
    try {
      if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPassword === ADMIN_PASSWORD) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('ecomz-admin-logged-in', 'true');
        }
        setIsAdmin(true);
        return { success: true, message: 'Login successful' };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  // Logout function
  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ecomz-admin-logged-in');
      }
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, loading }}>
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
