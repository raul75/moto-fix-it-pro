
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Use the supabase client from the integrations directory
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// We're extending the supabaseClient to explicitly type it with our custom Database type
const supabase = supabaseClient as ReturnType<typeof createClient<Database>>;

export default supabase;
