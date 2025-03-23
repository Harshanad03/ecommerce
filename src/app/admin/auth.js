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
    // Check localStorage on mount
    const adminStatus = localStorage.getItem('ecomz-admin-logged-in');
    setIsAdmin(adminStatus === 'true');
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // Trim inputs and make email case-insensitive
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    console.log(`Login attempt: ${cleanEmail}, ${cleanPassword}`);
    
    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPassword === ADMIN_PASSWORD) {
      localStorage.setItem('ecomz-admin-logged-in', 'true');
      setIsAdmin(true);
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('ecomz-admin-logged-in');
    setIsAdmin(false);
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
