<template>
  <div class="nav-component">
    <!-- Мобильное меню -->
    <MobileMenu v-if="isMobile" :links="navLinks" />

    <!-- Десктопная боковая панель -->
    <DesktopMenu v-else :links="navLinks" />

    <!-- Модальное окно поиска -->
    <transition name="fade">
      <ModalSearch v-if="navbarStore.isModalSearchVisible" />
    </transition>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store/main'
import { useAuthStore } from '@/store/auth'
import { useNavbarStore } from '@/store/navbar'
import { computed, ref, onMounted } from 'vue'
import DesktopMenu from './MenuNavigation/DesktopMenu.vue'
import MobileMenu from './MenuNavigation/MobileMenu.vue'
import ModalSearch from './ModalSearch.vue'
import { getBaseURLSync, getBaseURL } from '@/api/axios'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/firebase'

const store = useMainStore()
const authStore = useAuthStore()
const navbarStore = useNavbarStore()
const isMobile = computed(() => store.isMobile)
const navLinks = ref([])

const initializeNavLinks = (baseURL) => {
  navLinks.value = [
    { to: '/', exact: true, icon: 'fas fa-home', text: 'Главная' },
    {
      to: authStore.user ? '/user' : '/login',
      exact: true,
      icon: authStore.user
        ? authStore.user.photo
          ? `${baseURL}${authStore.user.photo}`
          : 'fas fa-user'
        : 'fas fa-right-to-bracket',
      text: authStore.user ? 'Профиль' : 'Войти'
    },
    ...(authStore.token
      ? [
          {
            to: '/lists',
            exact: true,
            icon: 'fas fa-bookmark',
            text: 'Мои списки'
          },
          {
            to: '/notifications',
            exact: true,
            icon: 'fas fa-bell',
            text: 'Уведомления',
            component: 'NotificationBadge'
          }
        ]
      : []),
    { to: '/top', icon: 'fa-solid fa-trophy', text: 'Популярное' },
    { to: '/settings', icon: 'fa-solid fa-gear', text: 'Настройки' }
  ]
}

const baseURL = getBaseURLSync()
initializeNavLinks(baseURL)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken()
      authStore.setToken(token)
      authStore.setUser({ id: user.uid, username: user.email?.split('@')[0] })
      const updatedBaseURL = await getBaseURL()
      initializeNavLinks(updatedBaseURL)
    } else {
      authStore.logout()
      initializeNavLinks(baseURL)
    }
  })
})
</script>

<style scoped>
.nav-component {
  font-family: inherit;
  font-weight: 400;
  font-size: 20px;
}

/* Стили для анимации fade */
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: all 0s;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}
</style>
</tr>
</tr>
