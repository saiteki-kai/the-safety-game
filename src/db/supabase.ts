import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types.ts";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
