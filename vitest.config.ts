/// <reference types="vitest/config" />
/// <reference types="vitest/browser" />

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/lib/supabase.generated.ts"],
    },
  },
});
