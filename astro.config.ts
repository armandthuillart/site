import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [
    {
      cssVariable: "--font-inter",
      name: "Inter",
      provider: fontProviders.fontsource(),
      weights: ["100 900"],
    },
  ],
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
  integrations: [mdx(), sitemap()],
  site: "https://armandthuillart.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
