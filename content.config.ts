import { defineCollection, defineContentConfig, property } from "@nuxt/content"
import { object, string, optional, picklist, array, number, date, pipe, minLength } from "valibot"

const createButtonSchema = () =>
  object({
    label: string(),
    icon: optional(string()),
    to: optional(string()),
    color: optional(picklist(["primary", "neutral", "success", "warning", "error", "info"])),
    size: optional(picklist(["xs", "sm", "md", "lg", "xl"])),
    variant: optional(picklist(["solid", "outline", "subtle", "soft", "ghost", "link"])),
    target: optional(picklist(["_blank", "_self"]))
  })

const createImageSchema = () =>
  object({
    src: property(string()).editor({ input: "media" }),
    alt: string()
  })

const createAuthorSchema = () =>
  object({
    name: string(),
    description: optional(string()),
    username: optional(string()),
    twitter: optional(string()),
    to: optional(string()),
    avatar: optional(createImageSchema())
  })

const commonSchema = object({
  title: string(),
  description: optional(string()),
  links: optional(array(createButtonSchema())),
  content: optional(string()),
  images: optional(array(createImageSchema()))
})

const blogSchema = object({
  ...commonSchema.entries,
  minRead: number(),
  date: date(),
  image: optional(property(string()).editor({ input: "media" })),
  author: createAuthorSchema()
})

const projectSchema = object({
  ...commonSchema.entries,
  title: pipe(string(), minLength(1)),
  description: pipe(string(), minLength(1)),
  image: optional(property(string()).editor({ input: "media" })),
  tags: array(string()),
  date: date()
})

const documentSchema = object({
  ...commonSchema.entries,
  type: optional(
    picklist(["privacy-policy", "cookie-policy", "terms-of-service", "code-of-conduct", "other"])
  ),
  lastUpdated: optional(date())
})

export default defineContentConfig({
  collections: {
    en_blog: defineCollection({
      type: "page",
      source: { include: "en/blog/**", prefix: "/blog" },
      schema: blogSchema
    }),
    en_documents: defineCollection({
      type: "page",
      source: { include: "en/documents/**", prefix: "/documents" },
      schema: documentSchema
    }),
    en_projects: defineCollection({
      type: "page",
      source: { include: "en/projects/**", prefix: "/projects" },
      schema: projectSchema
    }),
    en_pages: defineCollection({
      type: "page",
      source: { include: "en/*.{yml,md}", prefix: "/" },
      schema: commonSchema
    }),

    pt_blog: defineCollection({
      type: "page",
      source: { include: "pt/blog/**", prefix: "/pt/blog" },
      schema: blogSchema
    }),
    pt_documents: defineCollection({
      type: "page",
      source: { include: "pt/documents/**", prefix: "/pt/documents" },
      schema: documentSchema
    }),
    pt_projects: defineCollection({
      type: "page",
      source: { include: "pt/projects/**", prefix: "/pt/projects" },
      schema: projectSchema
    }),
    pt_pages: defineCollection({
      type: "page",
      source: { include: "pt/*.{yml,md}", prefix: "/pt" },
      schema: commonSchema
    }),
    all: defineCollection({
      type: "page",
      source: { include: "**" }
    })
  }
})
