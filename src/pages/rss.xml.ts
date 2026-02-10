import { getCollection } from "astro:content";
import rss, { type RSSOptions } from "@astrojs/rss";

export async function GET() {
	const blogPosts = await getCollection("blog");

	const rssOptions: RSSOptions = {
		description: "Designer and developer.",
		items: blogPosts.map((post) => ({
			...post.data,
			link: `${post.id}/`,
		})),
		site: "https://armandthuillart.com",
		title: "Armand Thuillart",
	};

	return rss(rssOptions);
}
