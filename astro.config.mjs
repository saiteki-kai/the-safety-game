import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import reactI18next from "astro-react-i18next";

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
  output: "server",

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
      namespaces,
    }),
  ],

  i18n: {
    defaultLocale: "it",
    locales: ["it", "en"],
  },

  experimental: {
    svgo: true,
  },
});
