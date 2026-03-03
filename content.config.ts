import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const createButtonSchema = () =>
  z.object({
    label: z.string(),
    icon: z.string().optional(),
    to: z.string().optional(),
    color: z.enum(["primary", "neutral", "success", "warning", "error", "info"]).optional(),
    size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
    variant: z.enum(["solid", "outline", "subtle", "soft", "ghost", "link"]).optional(),
    target: z.enum(["_blank", "_self"]).optional(),
  });

const createImageSchema = () =>
  z.object({
    src: z.string().editor({ input: "media" }),
    alt: z.string(),
  });

const createAuthorSchema = () =>
  z.object({
    name: z.string(),
    description: z.string().optional(),
    username: z.string().optional(),
    twitter: z.string().optional(),
    to: z.string().optional(),
    avatar: createImageSchema().optional(),
  });

const commonSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  links: z.array(createButtonSchema()).optional(),
  content: z.string().optional(),
  images: z.array(createImageSchema()).optional(),
});

const blogSchema = commonSchema.extend({
  minRead: z.number(),
  date: z.date(),
  image: z.string().nonempty().editor({ input: "media" }),
  author: createAuthorSchema(),
});

const projectSchema = commonSchema.extend({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  image: z.string().nonempty().editor({ input: "media" }),
  tags: z.array(z.string()),
  date: z.date(),
});

export default defineContentConfig({
  collections: {
    en_blog: defineCollection({
      type: "page",
      source: { include: "en/blog/**", prefix: "/blog" },
      schema: blogSchema,
    }),
    en_projects: defineCollection({
      type: "page",
      source: { include: "en/projects/**", prefix: "/projects" },
      schema: projectSchema,
    }),
    en_pages: defineCollection({
      type: "page",
      source: { include: "en/*.yml", prefix: "/" },
      schema: commonSchema,
    }),

    pt_blog: defineCollection({
      type: "page",
      source: { include: "pt/blog/**", prefix: "/blog" },
      schema: blogSchema,
    }),
    pt_projects: defineCollection({
      type: "page",
      source: { include: "pt/projects/**", prefix: "/projects" },
      schema: projectSchema,
    }),
    pt_pages: defineCollection({
      type: "page",
      source: { include: "pt/*.yml", prefix: "/" },
      schema: commonSchema,
    }),
    all: defineCollection({
      type: "page",
      source: { include: "**" },
    }),
  },
});
