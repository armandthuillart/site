import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  integrations: [mdx(), sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Die Grotesk B",
      cssVariable: "--font-die-grotesk-b",
      options: {
        variants: [
          {
            src: ["./public/fonts/die-grotesk-b-regular.woff2"],
            weight: 400,
          },
          {
            src: ["./public/fonts/die-grotesk-b-medium.woff2"],
            weight: 500,
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Die Grotesk A",
      cssVariable: "--font-die-grotesk-a",
      options: {
        variants: [
          {
            src: ["./public/fonts/die-grotesk-a-regular.woff2"],
            weight: 400,
          },
          {
            src: ["./public/fonts/die-grotesk-a-medium.woff2"],
            weight: 500,
          },
        ],
      },
    },
  ],
  site: "https://armandthuillart.com",
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
