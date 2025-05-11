    // src/lib/supabaseClient.ts
    import { createClient } from '@supabase/supabase-js';

    // Ensure dotenv is configured if you are in a Node.js environment
    // import 'dotenv/config'; // or require('dotenv').config();

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required.');
    }

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);