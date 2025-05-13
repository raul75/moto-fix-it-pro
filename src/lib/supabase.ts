
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Use the supabase client from the integrations directory
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Create a typed version of the supabase client
const supabase = supabaseClient as unknown as ReturnType<typeof createClient<Database>>;

export default supabase;
