import react from "@astrojs/react";
import vercelServerless from "@astrojs/vercel/serverless";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	output: "hybrid",
	adapter: vercelServerless(),

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [react()],
});
