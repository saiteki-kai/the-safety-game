import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import node from '@astrojs/node';

export default defineConfig({
  site: "https://thesafetygame.vercel.app/",

  output: "server",

  adapter: vercel({
    webAnalytics: true,
    imageService: true,
  }),
  // adapter: node({
  //   mode: "standalone",
  // }),

  session: {
    driver: "redis",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // Native Astro i18n configuration
  i18n: {
    defaultLocale: "it",
    locales: ["it", "en"],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [react()],

  experimental: {
    svgo: true,
  },
});
