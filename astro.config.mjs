import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import reactI18next from "astro-react-i18next";

export default defineConfig({
  output: "static",

  adapter: vercel({
    webAnalytics: true,
    imageService: true,
  }),

  session: {
    driver: "redis",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    reactI18next({
      defaultLocale: "it",
      locales: ["it", "en"],
    }),
  ],

  experimental: {
    svgo: true,
  },
});
