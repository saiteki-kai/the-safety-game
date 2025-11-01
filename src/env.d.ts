/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SECRET_SUPABASE_URL: string
  readonly SECRET_SUPABASE_KEY: string
  readonly SECRET_TEST_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
