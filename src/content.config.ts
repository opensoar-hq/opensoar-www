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
    ogImage: z.string().optional(),
    order: z.number().int().nonnegative(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heading: z.string(),
    subheading: z.string(),
    badge: z.string().default("Blog"),
    slug: z.string().optional(),
    ogImage: z.string().optional(),
    category: z.string(),
    publishedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    author: z.string().default("OpenSOAR"),
  }),
});

const alternatives = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/alternatives" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heading: z.string(),
    subheading: z.string(),
    badge: z.string().default("Alternative"),
    slug: z.string().optional(),
    ogImage: z.string().optional(),
    vendor: z.string(),
    order: z.number().int().nonnegative(),
  }),
});

export const collections = {
  guides,
  blog,
  alternatives,
};
