import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { SITE_URL } from "./src/constants";

export default defineConfig({
	adapter: vercel(),
	experimental: { contentIntellisense: true },
	fonts: [
		{
			cssVariable: "--font-inter",
			name: "Inter",
			provider: fontProviders.google(),
			weights: [400, 500],
		},
	],
	integrations: [mdx(), sitemap()],
	server: { port: 3000 },
	site: SITE_URL,
	vite: { plugins: [tailwindcss()] },
});
