import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { useThemeStore } from './store/theme'
import { useAuthStore } from './store/auth'
import { useAppSetup } from './composables/useAppSetup'

console.log(`App version: ${import.meta.env.VITE_APP_VERSION_FULL_VERSION}`)

registerSW({ immediate: true })

window.addEventListener('vite:preloadError', (event) => {
  console.log(`vite:preloadError ${event}`)
  window.location.reload()
})

const app = createApp(App)

// Create pinia first (stores need it before mounting)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Initialize auth BEFORE mounting to restore session
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  const themeStore = useThemeStore()
  themeStore.initTheme()
  
  useAppSetup(app)
})
