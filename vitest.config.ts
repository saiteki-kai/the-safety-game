/// <reference types="vitest/config" />
/// <reference types="vitest/browser" />

import react from "@vitejs/plugin-react";
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    plugins: [react()],
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/lib/supabase.generated.ts"],
    },
  },
});
