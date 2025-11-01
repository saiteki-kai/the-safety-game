import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://saiteki-kai.github.io",
  base: "/demo-github-pages/",

  vite: {
      plugins: [tailwindcss()],
	},

  integrations: [react()],
});