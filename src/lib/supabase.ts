
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Utilizziamo il client Supabase dalla directory integrations
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Esportiamo il client Supabase per mantenere la compatibilità con il codice esistente
const supabase = supabaseClient;

export default supabase;
