import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	build: {
		rollupOptions: {
			onwarn() {
				return;
			},
		},
	},
	plugins: [
		mdx(await import("./source.config"), {
			index: { target: "vite" },
		}),
		nitro({
			preset: "vercel",
			rollupConfig: {
				onwarn() {
					return;
				},
			},
			vercel: { entryFormat: "node" },
		}),
		tailwindcss({
			optimize: { minify: true },
		}),
		tanstackStart({
			prerender: {
				crawlLinks: true,
				enabled: false, // https://github.com/nitrojs/nitro/issues/3905
				filter: (page) => !page.path.includes("#"),
			},
			sitemap: {
				enabled: true,
				host: "https://armandthuillart.com",
			},
		}),
		tsconfigPaths({
			configNames: ["tsconfig.json"],
		}),
		viteReact(),
	],
	preview: {
		port: 3000,
	},
	server: {
		port: 3000,
	},
});
