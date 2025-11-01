import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://saiteki-kai.github.io",
	base: "/demo-github-pages/",

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [react()],
});
