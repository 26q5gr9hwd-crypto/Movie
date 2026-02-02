import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import { routes } from './routes'
import { useMainStore } from '@/store/main'
import { useNavbarStore } from '@/store/navbar'
import { useAuthStore } from '@/store/auth'
import { handleHashNavigation } from '@/helpers/hashHandler'
import { useScrollTracking } from '@/composables/useScrollTracking'

const base = import.meta.env.VITE_BASE_URL || '/'
console.log(base: ${base})
const { userHasScrolled, startTracking } = useScrollTracking()
const router = createRouter({
  history: createWebHistory(base),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    const mainStore = useMainStore()

    return new Promise((resolve) => {
      nextTick(() => {
        if (to.name === 'movie-info') {
          return resolve({ top: 0, behavior: 'smooth' })
        } else if (
          savedPosition &&
          mainStore.rememberScrollPosition &&
          !userHasScrolled &&
          (to.name === 'top-movies' || to.name === 'lists')
        ) {
          setTimeout(() => {
            return resolve(savedPosition)
          }, 1000)
        } else {
          return resolve({ top: 0, behavior: 'smooth' })
        }
      })
    })
  }
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // Auth guard - redirect to login if route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  const title = to.meta.title || 'DanFlix'
  document.title = title

  startTracking()

  // Handle search query param for !bang support
  // URL: https://danflix.ru/?q=searchterm
  if (to.query.q) {
    const navbarStore = useNavbarStore()
    nextTick(() => {
      const query = String(to.query.q)
      navbarStore.openSearchModal()
      navbarStore.setSearchQuery(query)
    })
  }

  if (to.hash) {
    handleHashNavigation(to, next)
  } else {
    next()
  }
})

export default router
