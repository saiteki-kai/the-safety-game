import { createBrowserClient } from '@supabase/ssr'
import type { Database } from "./types.ts";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

export function createClient() {
    return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
