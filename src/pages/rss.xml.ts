import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { SITE_DESCRIPTION, SITE_NAME } from "../lib/site";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("blog");

  return rss({
    description: SITE_DESCRIPTION,
    items: posts.map((post) => ({
      ...post.data,
      link: `${post.id}/`,
    })),
    title: SITE_NAME,
    site: site!.href,
  });
};
