import { createClient } from "@supabase/supabase-js";
import type { Database } from './types.ts';

console.log(process.env); // For debugging purposes
console.log(import.meta.env);

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
