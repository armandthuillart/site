import tailwindcss from "@tailwindcss/vite";
import { tailwindcssObfuscator } from "@tailwindcss-obfuscator/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		mdx(await import("./source.config.ts"), {
			index: { target: "vite" },
		}),
		nitro({
			preset: "vercel",
			vercel: { entryFormat: "node" },
		}),
		tailwindcss({
			optimize: { minify: true },
		}),
		tailwindcssObfuscator({
			cssEntry: "./src/styles/app.css",
		}),
		tanstackStart({
			prerender: { enabled: true },
			sitemap: { enabled: true, host: "https://neap.app" },
		}),
		tsconfigPaths({
			configNames: ["tsconfig.json"],
		}),
		viteReact(),
	],
	server: {
		port: 3000,
	},
});
