import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heading: z.string(),
    subheading: z.string(),
    badge: z.string().default("Guide"),
    slug: z.string().optional(),
    order: z.number().int().nonnegative(),
  }),
});

export const collections = {
  guides,
};
