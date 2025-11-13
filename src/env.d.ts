import type { Team, Profile, Database } from "@/lib/supabase.types.ts";

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    interface Locals {
      user: Profile | null;
      team: Team | null;
      user_id: string | null;
      db: import("@supabase/supabase-js").SupabaseClient<Database> | null;
    }
  }
}
