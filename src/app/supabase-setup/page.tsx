import { checkSupabaseEnv } from '@/lib/env-checker';

export default function SupabaseSetupPage() {
  const envStatus = checkSupabaseEnv();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Supabase Setup Status</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Environment Variables</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Status of your Supabase configuration</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Configuration Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {envStatus.isConfigured ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Not Configured
                  </span>
                )}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">NEXT_PUBLIC_SUPABASE_URL</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {envStatus.supabaseUrl}
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">NEXT_PUBLIC_SUPABASE_ANON_KEY</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {envStatus.supabaseAnonKey}
              </dd>
            </div>
            
            {!envStatus.isConfigured && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Issues</dt>
                <dd className="mt-1 text-sm text-red-600 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {envStatus.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Next Steps</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Follow these instructions to complete your Supabase setup</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <ol className="list-decimal pl-5 space-y-3">
            <li className="text-sm text-gray-700">
              Create a <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file in your project root with your Supabase credentials
            </li>
            <li className="text-sm text-gray-700">
              Create a products table in your Supabase database with the appropriate schema
            </li>
            <li className="text-sm text-gray-700">
              Implement the API functions to interact with your Supabase database
            </li>
            <li className="text-sm text-gray-700">
              Update your application to use the Supabase data instead of the local data
            </li>
          </ol>
          
          <div className="mt-6">
            <p className="text-sm text-gray-700">
              For detailed instructions, please refer to the <code className="bg-gray-100 px-1 py-0.5 rounded">src/lib/env-setup-guide.md</code> file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
