import { getCollection } from "astro:content";
import rss, { type RSSOptions } from "@astrojs/rss";

const SITE_URL = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export async function GET() {
	const blogPosts = await getCollection("blog");

	const rssOptions: RSSOptions = {
		description: "Designer and developer.",
		items: blogPosts.map((post) => ({
			...post.data,
			link: `${post.id}/`,
		})),
		site: SITE_URL,
		title: "Armand Thuillart",
	};

	return rss(rssOptions);
}
