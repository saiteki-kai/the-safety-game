/// <reference path="../.astro/types.d.ts" />
import { type User } from "@supabase/supabase-js";
import { type Team } from "@db/types";

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_KEY: string;
  readonly SECRET_SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    interface Locals {
      user: string | null;
      team: Team | null;
    }
  }
}
