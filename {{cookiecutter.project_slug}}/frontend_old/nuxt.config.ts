// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    app: {
        head: {
          meta: [
            { charset: "utf-8" },
            // <meta name="viewport" content="width=device-width, initial-scale=1">
            { name: "viewport", content: "width=device-width, initial-scale=1" }
          ],
          script: [
            // <script src="https://myawesome-lib.js"></script>
            // { src: "@/assets/css/main.css" }
          ],
          noscript: [
            // <noscript>Javascript is required</noscript>
            { children: "Javascript is required" }
          ]
        },
        // pageTransition: { name: "page", mode: "out-in" }
      },
    runtimeConfig: {
      // https://nuxt.com/docs/api/composables/use-runtime-config#using-the-env-file
      // Private keys are only available on the server
      apiSecret: process.env.VUE_PRIVATE_TERM,
      // Public keys that are exposed to the client
      public: {
        appName: process.env.VUE_APP_NAME,
        appEnv: process.env.VUE_APP_ENV,
        apiWS: process.env.VUE_APP_DOMAIN_WS,
        apiUrl: process.env.VUE_APP_DOMAIN_API,
        // idbName: process.env.VUE_IDB_NAME,
        // idbVersion: process.env.VUE_IDB_VERSION,
      }
    },
    modules: [
      "@nuxtjs/i18n",
      "@pinia/nuxt",
      "@pinia-plugin-persistedstate/nuxt",
      "@nuxt/content",
      "tailwindcss",
      "@nuxtjs/robots",
      "@vite-pwa/nuxt",
    ],
    pinia: {
      autoImports: [
        "definePiniaStore",
        "defineStore",
      ],
    },
    piniaPersistedstate: {
      cookieOptions: {
        path: "/",
        // maxAge: 60 * 60 * 24 * 30,
        secure: true,
      },
    },
    content: {
      // https://content.nuxtjs.org/api/configuration
      // https://stackblitz.com/edit/nuxt-starter-jnysug
      // https://stackoverflow.com/q/76421724
      navigation: {
        fields: ["title", "author", "publishedAt"]
      },
      locales: ["en", "fr"],
      defaultLocale: "en",
    },
    i18n: {
      // https://phrase.com/blog/posts/nuxt-js-tutorial-i18n/
      // https://v8.i18n.nuxtjs.org/
      // https://stackblitz.com/edit/nuxt-starter-jnysug
      locales: [
        {
          code: "en",
          name: "English",
          iso: "en-GB",
          dir: "ltr",
          file: "en-GB.ts",
        },
        {
          code: "fr",
          name: "Français",
          iso: "fr-FR",
          dir: "ltr",
          file: "fr-FR.ts",
        }
      ], 
      defaultLocale: "en",
      detectBrowserLanguage: false,
      lazy: true,
      langDir: "locales",
      strategy: "prefix_and_default",
      vueI18n: "./config/i18n.ts",
    },
    robots: {
      // https://nuxt.com/modules/robots
      rules: [
        {
          UserAgent: "GPTBot",
          Disallow: "/"
        },
      ]
    },
    pwa: {
      // https://vite-pwa-org.netlify.app/frameworks/nuxt.html
      // https://github.com/vite-pwa/nuxt/blob/main/playground
      // Generate icons with: 
      //   node node_modules/@vite-pwa/assets-generator/bin/pwa-assets-generator.mjs --preset minimal public/images/logo.svg
      registerType: "autoUpdate",
      manifest: {
        name: "Nuxt FastAPI Base App",
        short_name: "NuxtFastAPIApp",
        theme_color: "#f43f5e",
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'  
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
      },
      workbox: {
        navigateFallback: "/",
        globPatterns: ["**/*.{js,json,css,html,txt,svg,png,icon,ebpt,woff,woff2,ttf,eot,otf,wasm}"]
      },
      client: {
        installPrompt: true,
      },
      devOptions: {
        envabled: true,
        suppressWarnings: true,
        navigateFallbackAllowlist: [/^\/$/],
        type: "module",
      },
    },
    css: ["~/assets/css/main.css"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    build: {
      transpile: ["@heroicons/vue"]
    }
})
