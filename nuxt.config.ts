export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "nuxt-zod-i18n",
    "@nuxt/content",
    "@nuxt/image",
    "nuxt-og-image",
    "@vueuse/nuxt",
    "@nuxthub/core",
    "@nuxt/scripts",
    "@nuxtjs/turnstile",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@pinia/nuxt",
    "magic-regexp/nuxt",
    "nuxt-echarts",
    "@nuxtjs/device",
    "@nuxtjs/html-validator",
    "nuxt-security"
  ],
  htmlValidator: {
    usePrettier: true
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
      prefix: "QK"
    }
  ],
  devtools: {
    enabled: true
  },
  app: {
    head: {
      title: "Queer Kit",
      titleTemplate: "%s | Queer Kit",
      meta: [
        {
          name: "description",
          content: ""
        },
        {
          name: "author",
          content: "Queer Kit"
        },
        {
          name: "creator",
          content: "Queer Kit"
        }
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg"
        }
      ]
    }
  },
  css: ["./app/assets/css/main.css"],
  site: {
    url: "https://queerkit.com",
    name: "Queer Kit",
    // Should be changed to true upon release to the public.
    indexable: false
  },
  colorMode: {
    preference: "light",
    fallback: "light"
  },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3
        }
      }
    }
  },
  ui: {
    prefix: "U"
  },
  runtimeConfig: {
    public: {
      constructionPassword: process.env.SITE_PASSWORD || "secret"
    },
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY
    }
  },
  compatibilityDate: "2025-07-15",
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/"]
    }
  },
  hub: {
    blob: true,
    database: true
  },
  fonts: {
    defaults: {
      weights: [
        // Thin
        100,
        // ExtraLight
        200,
        // Light
        300,
        // Regular
        400,
        // Medium
        500,
        // SemiBold
        600,
        // Bold
        700,
        // Extra Bold
        800
      ],
      styles: ["normal", "italic"]
    },
    families: [
      {
        name: "JetBrains Mono",
        global: true,
        provider: "local"
      }
    ]
  },
  i18n: {
    defaultLocale: "en",
    locales: [
      {
        code: "ar",
        name: "العربية"
      },
      {
        code: "en",
        name: "English"
      },
      {
        code: "es",
        name: "Español"
      },
      {
        code: "fr",
        name: "Français"
      },
      {
        code: "ja",
        name: "日本語"
      },
      {
        code: "ko",
        name: "한국어"
      },
      {
        code: "pt",
        name: "Português"
      },
      {
        code: "ro",
        name: "Română"
      },
      {
        code: "zh_cn",
        name: "简体中文"
      }
    ]
  },
  icon: {
    provider: "server",
    class: "icon",
    size: "24px",
    mode: "css",
    customCollections: [
      {
        prefix: "first-party",
        dir: "./app/assets/icons/first-party",
        normalizeIconName: false
      },
      {
        prefix: "third-party",
        dir: "./app/assets/icons/third-party",
        normalizeIconName: false
      },
      {
        prefix: "flags",
        dir: "./app/assets/icons/flags",
        normalizeIconName: false
      }
    ]
  },
  robots: {
    blockAiBots: false,
    blockNonSeoBots: false,
    disallow: ["/internal"]
  },
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY
  }
})