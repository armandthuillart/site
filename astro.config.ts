import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default defineConfig({
	adapter: cloudflare({
		imageService: "compile",
	}),
	experimental: {
		contentIntellisense: true,
	},
	integrations: [mdx(), sitemap()],
	markdown: {
		rehypePlugins: [rehypeKatex],
		remarkPlugins: [remarkMath],
	},
	site: "https://armandthuillart.com",
	vite: {
		plugins: [tailwindcss()],
	},
});
