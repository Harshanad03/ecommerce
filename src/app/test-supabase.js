'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing Supabase connection...');
  const [buckets, setBuckets] = useState([]);
  const [tables, setTables] = useState([]);
  
  useEffect(() => {
    async function testConnection() {
      try {
        // Test authentication
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
          setStatus(`Auth Error: ${authError.message}`);
          return;
        }
        
        // Test storage buckets
        const { data: bucketsData, error: bucketsError } = await supabase.storage.listBuckets();
        if (bucketsError) {
          setStatus(`Storage Error: ${bucketsError.message}`);
          return;
        }
        setBuckets(bucketsData);
        
        // Test database tables
        const { data: tablesData, error: tablesError } = await supabase.from('products').select('id').limit(1);
        if (tablesError) {
          setStatus(`Database Error: ${tablesError.message}`);
          return;
        }
        
        setStatus('Supabase connection successful!');
        setTables(['products']);
      } catch (error) {
        setStatus(`Unexpected Error: ${error.message}`);
      }
    }
    
    testConnection();
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="mb-4">
        <p className="font-semibold">Status:</p>
        <p className={status.includes('Error') ? 'text-red-500' : 'text-green-500'}>
          {status}
        </p>
      </div>
      
      <div className="mb-4">
        <p className="font-semibold">Storage Buckets:</p>
        {buckets.length > 0 ? (
          <ul className="list-disc ml-5">
            {buckets.map(bucket => (
              <li key={bucket.id}>{bucket.name}</li>
            ))}
          </ul>
        ) : (
          <p>No buckets found or still loading...</p>
        )}
      </div>
      
      <div>
        <p className="font-semibold">Database Tables:</p>
        {tables.length > 0 ? (
          <ul className="list-disc ml-5">
            {tables.map(table => (
              <li key={table}>{table}</li>
            ))}
          </ul>
        ) : (
          <p>No tables found or still loading...</p>
        )}
      </div>
    </div>
  );
}
