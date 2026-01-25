import router from '@/router'
import VueCookies from 'vue3-cookies'
import { initYandexMetrika } from 'yandex-metrika-vue3'
import VueLazyload from 'vue-lazyload'
import { LAZY_LOADING_CONFIG } from '@/constants'
import jQuery from 'jquery'

export const useAppSetup = (app) => {
  // Note: pinia is already configured in Main.js before this runs
  
  app.provide('$', jQuery)
  app
    .use(VueLazyload, LAZY_LOADING_CONFIG)
    .use(VueCookies)
    .use(router)
    .use(initYandexMetrika, {
      id: import.meta.env.VITE_YANDEX_METRIKA_ID,
      router: router,
      env: process.env.NODE_ENV
    })
  app.mount('#app')
}
