import { createClient } from "@supabase/supabase-js";
import type { Database } from './types.ts';

console.log(process.env.SECRET_TEST_KEY);
console.log(import.meta.env.SECRET_TEST_KEY);

const supabaseUrl = import.meta.env.SECRET_SUPABASE_URL;
const supabaseKey = import.meta.env.SECRET_SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
