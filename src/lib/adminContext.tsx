"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simple admin credentials - in a real app, these would be stored securely
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

interface AdminContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on component mount
    const checkAdminStatus = () => {
      if (typeof window !== 'undefined') {
        const adminStatus = localStorage.getItem('ecomz-admin-logged-in');
        setIsAdmin(adminStatus === 'true');
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  const login = async (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecomz-admin-logged-in', 'true');
      }
      setIsAdmin(true);
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecomz-admin-logged-in');
    }
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
