import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
	loader: glob({
		base: "./src/content/blog",
		pattern: "**/*.mdx",
	}),
	schema: z.object({
		date: z.optional(z.coerce.date()),
		headline: z.string(),
		metadata: z.object({ title: z.string() }),
		title: z.string(),
	}),
});

export const collections = { blog };
