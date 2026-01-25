import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { registerSW } from 'virtual:pwa-register'
import { useThemeStore } from './store/theme'
import { useAppSetup } from './composables/useAppSetup'
import { createApp } from 'vue'
import App from './App.vue'

console.log(`App version: ${import.meta.env.VITE_APP_VERSION_FULL_VERSION}`)

registerSW({ immediate: true })

window.addEventListener('vite:preloadError', (event) => {
  console.log(`vite:preloadError ${event}`)
  window.location.reload()
})

const app = createApp(App)

useAppSetup(app)

// Initialize stores after app setup
const themeStore = useThemeStore()
themeStore.initTheme()
// Initialize auth (restores session if user was logged in)
import { useAuthStore } from './store/auth'
const authStore = useAuthStore()
authStore.initAuth()
