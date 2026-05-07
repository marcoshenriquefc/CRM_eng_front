export default defineNuxtConfig({
  compatibilityDate: '2026-05-06',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? '/api/v1'
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
