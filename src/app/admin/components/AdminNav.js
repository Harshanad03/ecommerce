"use client";

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '../auth';

export default function AdminNav() {
  const { isAdmin, logout, user } = useAdmin();

  if (!isAdmin) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Add admin navigation links here if needed in the future */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 