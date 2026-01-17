import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		mdx(await import("./source.config")),
		tailwindcss(),
		tsconfigPaths(),
		tanstackStart({
			prerender: {
				crawlLinks: true,
				enabled: true,
			},
			sitemap: {
				enabled: true,
				host: "https://armandthuillart.com",
			},
		}),
		nitro({
			preset: "vercel",
		}),
		react(),
	],
	server: {
		port: 3000,
	},
});
