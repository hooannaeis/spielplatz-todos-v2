import firebaseConfig from "./firebaseConfig"

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'spielplatz-todos-v2',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/pwa',
    '@nuxtjs/firebase',
  ],
  firebase: {
    config: firebaseConfig,
    onFirebaseHosting: true,
    services: {
      firestore: {
        memoryOnly: false, // default
        enablePersistence: true,
      },
      storage: true,
      analytics: true
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'de',
      meta: {
        theme_color: "green"
      }
    }
  },
  target: 'static',
  ssr: false,
  generate: {
    fallback: true,
  },
}
