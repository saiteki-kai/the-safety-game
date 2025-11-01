import { createClient } from "@supabase/supabase-js";
import type { Database } from './types.ts';

console.log(process.env.PUBLIC_TEST_KEY);
console.log(import.meta.env.PUBLIC_TEST_KEY);

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
