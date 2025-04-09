"use client";

import React from 'react';
import Link from 'next/link';

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 