// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    [
      '~/lib/nuxt-modules/apollo/module.ts',
      {
        configResolvers: {
          default: '~/lib/configs/apollo.ts'
        }
      }
    ]
  ],

  build: {
    transpile: [
      /^@apollo\/client/,
      'ts-invariant/process',
      '@vue/apollo-composable',
      '@headlessui/vue',
      '@heroicons/vue',
      '@vueuse/core'
    ]
  }
})
