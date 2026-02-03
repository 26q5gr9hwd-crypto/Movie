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
import { useNavbarStore } from '@/store/navbar'
import { computed, ref } from 'vue'
import DesktopMenu from './MenuNavigation/DesktopMenu.vue'
import MobileMenu from './MenuNavigation/MobileMenu.vue'
import ModalSearch from './ModalSearch.vue'

// Auth imports REMOVED
// import { useAuthStore } from '@/store/auth'
// import { onAuthStateChanged } from 'firebase/auth'
// import { auth } from '@/firebase/firebase'

const store = useMainStore()
const navbarStore = useNavbarStore()
const isMobile = computed(() => store.isMobile)
const navLinks = ref([])

  // Auth-dependent menu items removed (profile, lists, notifications)
  // Will be re-added when new auth system is built in Phase 3
  navLinks.value = [
    { to: '/', exact: true, icon: 'fas fa-home', text: 'Главная' },
    { to: '/top', icon: 'fas fa-fire', text: 'Популярное' },
    { to: '/settings', exact: true, icon: 'fas fa-cog', text: 'Настройки' },
    { to: '/contact', exact: true, icon: 'fas fa-envelope', text: 'Контакты' }
  ]

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
