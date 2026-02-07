import { getCollection } from "astro:content";
import rss, { type RSSOptions } from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../constants";

export async function GET() {
	const blogPosts = await getCollection("blog");

	const rssOptions: RSSOptions = {
		description: SITE_DESCRIPTION,
		items: blogPosts.map((post) => ({
			...post.data,
			link: `${post.id}/`,
		})),
		site: SITE_URL,
		title: SITE_TITLE,
	};

	return rss(rssOptions);
}
