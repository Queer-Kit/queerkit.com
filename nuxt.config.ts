import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const isTauri = process.env.NUXT_APP_TARGET === "tauri";

const currentDir = fileURLToPath(new URL(".", import.meta.url));
const localLayerPath = resolve(currentDir, "../rimelight-components");
const isLocalLayer = existsSync(localLayerPath);

export default defineNuxtConfig({
  extends: [
    [
      isLocalLayer ? localLayerPath : "github:Rimelight-Entertainment/rimelight-components",
      { install: true },
    ],
  ],

  modules: [],

  ignore: ["**/src-tauri/**"],

  $development: {
    site: { indexable: false },
  },

  $production: {
    nitro: {
      scheduledTasks: {
        // Daily at midnight
        "0 0 * * *": ["cleanup-notes-trash", "cleanup-todos-archived"],
      },
      routeRules: {
        "/documents/**": { isr: true },
        "/blog/**": { isr: true },
        "/dashboard/**": {
          ssr: false,
          appLayout: "dashboard",
        },
        "/store/**": {
          appLayout: "store",
        },
      },
    },
    site: {
      url: "https://queerkit.com",
      // Switch to true on release
      indexable: false,
    },
  },

  vite: {
    envPrefix: ["TAURI_"],
    server: {
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
  },

  alias: {
    "#types": fileURLToPath(new URL("./app/types", import.meta.url)),
    "#validators": fileURLToPath(new URL("./shared/validators", import.meta.url)),
    "drizzle-orm": fileURLToPath(new URL("./node_modules/drizzle-orm", import.meta.url)),
    ...(isLocalLayer
      ? {
          "#rimelight-components/types": resolve(localLayerPath, "app/types"),
          "#rimelight-components/utils": resolve(localLayerPath, "app/utils"),
          "#rimelight-components/validators": resolve(localLayerPath, "shared/validators"),
          "#rimelight-components/auth": resolve(localLayerPath, "shared/auth"),
          "#rimelight-components/db": resolve(localLayerPath, "shared/db"),
          "rimelight-components": localLayerPath,
        }
      : {}),
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://queerkit.com",
      isTauri,
    },
  },

  app: {
    baseURL: isTauri ? "" : "/",
    head: {
      title: "Queer Kit",
      titleTemplate: "%s | Queer Kit",
      meta: [
        {
          name: "description",
          content: "Your guide to all things queer.",
        },
        {
          name: "author",
          content: "Queer Kit",
        },
        {
          name: "creator",
          content: "Queer Kit",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
        {
          rel: "preconnect",
          href: "https://cdn.queerkit.com",
        },
        {
          rel: "dns-prefetch",
          href: "https://cdn.queerkit.com",
        },
      ],
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "https://cdn.queerkit.com", "https://i.ytimg.com", "https://*.youtube.com"],
        "connect-src": ["'self'", "https://queerkit.com", "https://*.youtube.com"],
        "frame-src": ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
        "script-src": ["'self'", "https:", "'unsafe-inline'", "'strict-dynamic'", "'nonce-{{nonce}}'", "https://www.youtube.com", "https://s.ytimg.com"]
      }
    }
  },

  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      cookieSecure: true,
      alwaysRedirect: false,
    },
    locales: [
      {
        code: "en",
        name: "English",
        language: "en-US",
        file: "en.json",
      },
      {
        code: "pt",
        name: "Português",
        language: "pt-BR",
        file: "pt.json",
      },
    ],
  },

  css: ["~/assets/css/main.css"],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
      prefix: "QK",
    },
    {
      path: "~/pages",
      pattern: "**/components/**",
      pathPrefix: false,
      prefix: "QK",
    },
  ],

  fonts: {
    families: [],
  },

  icon: {
    customCollections: [
      {
        prefix: "flags",
        dir: "./app/assets/icons/first-party/flags",
        normalizeIconName: false,
      },
      {
        prefix: "flag",
        dir: "./public/images/flags",
        normalizeIconName: false,
      },
    ],
  },

  image: {
    domains: ["queerkit.com"],
    cloudflare: {
      baseURL: "https://cdn.queerkit.com",
    },
  },

  studio: {
    repository: {
      owner: "Queer-Kit",
      repo: "queerkit.com",
    },
  },

  llms: {
    domain: "https://queerkit.com",
    title: "Queer Kit",
    description: "Your guide to all things queer.",
  },
});
