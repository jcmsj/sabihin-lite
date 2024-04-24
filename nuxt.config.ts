// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nuxt-icon",
    "@nuxtjs/tailwindcss",
    '@vueuse/nuxt',
    "@formkit/nuxt",
    "@sidebase/nuxt-auth"
  ],
  vue: {
    propsDestructure: true,
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
    viewer: false,
  },
  devtools: { enabled: false},
  nitro: {
    esbuild: {
        options: {
          // Need TOP LEVEL AWAIT
          target: "ES2022",
          minify: false,
        },
    }
  },
})
