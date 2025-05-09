
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client to use when real credentials aren't available
const createDummyClient = () => {
  console.warn(
    'Supabase environment variables missing. Using mock data instead. ' +
    'To use Supabase, please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    'are provided in your environment.'
  );
  
  return {
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
};

// Determine which client to export
let supabase;

// Check for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  // For development mode, use mock values
  if (import.meta.env.DEV) {
    // @ts-ignore - We're providing a partial implementation to avoid runtime errors
    supabase = createDummyClient();
  } else {
    // In production, we still want to fail to ensure proper configuration
    throw new Error(
      'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY are provided in your environment.'
    );
  }
} else {
  // Create the Supabase client with the provided credentials
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Export the client (either real or dummy)
export default supabase;
