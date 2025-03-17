// This file helps you verify if your Supabase environment variables are properly set up

export function checkSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const issues = [];
  
  if (!supabaseUrl) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL is not set');
  } else if (!supabaseUrl.includes('supabase.co')) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL');
  }
  
  if (!supabaseAnonKey) {
    issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  } else if (!supabaseAnonKey.startsWith('eyJ')) {
    issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY does not appear to be a valid Supabase anon key');
  }
  
  return {
    isConfigured: issues.length === 0,
    issues,
    supabaseUrl: supabaseUrl || 'Not set',
    supabaseAnonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 5)}...` : 'Not set'
  };
}
