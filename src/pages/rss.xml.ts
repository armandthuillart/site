import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error("Astro 'site' must be configured for RSS.");
  const feed = await getCollection("blog");

  return rss({
    description: "Designer and developer.",
    items: feed.map((item) => ({
      ...item.data,
      link: `${item.id}/`,
    })),
    title: "Armand Thuillart",
    site: site.href,
  });
};
