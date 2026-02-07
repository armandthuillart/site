import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const SITE_URL = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export default defineConfig({
	adapter: vercel(),
	experimental: { contentIntellisense: true },
	integrations: [mdx(), sitemap()],
	markdown: {
		rehypePlugins: [rehypeKatex],
		remarkPlugins: [remarkMath],
	},
	server: { port: 3000 },
	site: SITE_URL,
	vite: { plugins: [tailwindcss()] },
});
