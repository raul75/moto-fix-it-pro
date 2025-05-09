
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  // For development mode, use mock values or fallback to the mock data
  if (import.meta.env.DEV) {
    console.warn(
      'Supabase environment variables missing. Using mock data instead. ' +
      'To use Supabase, please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
      'are provided in your environment.'
    );
    
    // Export a dummy client that will be replaced with proper implementation
    const dummyClient = {
      // Add minimal implementation to prevent runtime errors
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
          order: () => ({ data: [], error: null }),
        }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: '' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };
    
    // @ts-ignore - We're providing a partial implementation to avoid runtime errors
    export default dummyClient;
  } else {
    // In production, we still want to fail to ensure proper configuration
    throw new Error(
      'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY are provided in your environment.'
    );
  }
} else {
  // Create and export the Supabase client with the provided credentials
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  export default supabase;
}
