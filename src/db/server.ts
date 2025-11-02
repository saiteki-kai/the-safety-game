export const prerender = false;

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types.ts";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.SECRET_SUPABASE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey ? "********" : "Not Set");

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});
