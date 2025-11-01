/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_KEY: string
  readonly PUBLIC_TEST_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
