import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import reactI18next from "astro-react-i18next";
import node from '@astrojs/node';

// Define namespaces for i18next
const namespaces = [
  "common",
  "nav",
  "sections",
  "auth",
  "footer",
  "dashboard",
  "forms",
  "errors",
  "meta",
  "home",
  "challenge",
  "leaderboard",
  "team",
  "participation",
  "dates",
  "instructions",
  "faq",
  "setup",
];

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

  integrations: [
    react(),
    reactI18next({
      defaultLocale: "it",
      locales: ["it", "en"],
      namespaces,
      prefixDefaultLocale: false,
    }),
  ],

  experimental: {
    svgo: true,
  },
});
