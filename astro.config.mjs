import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",

  adapter: vercel({
    webAnalytics: true,
    imageService: true,
  }),

  session: {
    driver: "redis",
  },

  i18n: {
    locales: ["it", "en"],
    defaultLocale: "it"
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],

  experimental: {
    svgo: true,
  }
});
