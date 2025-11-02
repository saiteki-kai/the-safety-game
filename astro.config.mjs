import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	output: "static",

	adapter: vercel({
		webAnalytics: true,
	}),

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [react()],
});
