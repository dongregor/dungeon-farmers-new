export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxt/test-utils',
    '@nuxt/icon',
    // Optional: '@nuxtjs/color-mode', '@nuxt/image', '@nuxt/fonts', '@nuxt/eslint'
  ],
  css: ['~/app/assets/css/main.css'],
  typescript: {
    strict: true,
  },
  supabase: {
    redirect: false,
  },
})
