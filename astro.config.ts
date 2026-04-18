import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [
    {
      cssVariable: "--font-die-grotesk-a",
      name: "Die Grotesk A",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/die-grotesk-a-regular.woff2"],
            weight: 400,
          },
          {
            src: ["./src/assets/fonts/die-grotesk-a-medium.woff2"],
            weight: 500,
          },
        ],
      },
      provider: fontProviders.local(),
    },
    {
      cssVariable: "--font-die-grotesk-b",
      name: "Die Grotesk B",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/die-grotesk-b-regular.woff2"],
            weight: 400,
          },
          {
            src: ["./src/assets/fonts/die-grotesk-b-medium.woff2"],
            weight: 500,
          },
        ],
      },
      provider: fontProviders.local(),
    },
  ],
  integrations: [mdx(), sitemap()],
  site: "https://armandthuillart.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
