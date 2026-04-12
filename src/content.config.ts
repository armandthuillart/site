import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.mdx",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.string().optional(),
    date: z.optional(z.coerce.date()),
    draft: z.boolean(),
  }),
});

export const collections = { blog };
