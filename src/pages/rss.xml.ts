import rss, { type RSSOptions } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("blog");

  const rssOptions: RSSOptions = {
    description: "Designer and developer.",
    items: posts.map((post) => ({
      ...post.data,
      link: `${post.id}/`,
    })),
    title: "Armand Thuillart",
    site: site!.href,
  };

  return rss(rssOptions);
};
