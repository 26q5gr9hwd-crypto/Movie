<template>
  <BackgroundSpace />
  <MobileHeader v-if="isMobile"/>
  <MenuNavigation />
  
  <div :class="['router-view-container', { 'router-view-container--with-mobile-header': isMobile }]">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>

  <!-- Затемняющий оверлей для обычного режима, включается тумблером -->
  <div v-if="dimmingEnabled" class="dimming-overlay" @click="toggleDimming"></div>
</template>

<script setup>
import BackgroundSpace from '@/components/BackgroundSpace.vue'
import MenuNavigation from '@/components/MenuNavigation.vue'
import MobileHeader from '@/components/MobileHeader.vue'
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isMobile = computed(() => store.state.isMobile)

// Реактивное состояние для ширины окна
const updateIsMobile = () => {
  store.commit('setIsMobile', window.innerWidth < 600)
}

onMounted(() => {
  store.commit('setIsMobile', window.innerWidth < 600)
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

const dimmingEnabled = computed(() => store.state.dimmingEnabled)
const toggleDimming = () => {
  store.commit('toggleDimming')
}
</script>

<style>
@import '@/assets/main.css';

#app {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Затемняющий оверлей для обычного режима */
.dimming-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 5;
}

/* Стиль для страницы с учетом мобильного хедера */
.router-view-container {
  padding-top: 0; /* По умолчанию без отступа */
}

/* Отступ сверху для мобильного хедера */
.router-view-container--with-mobile-header {
  padding-top: 60px; /* Здесь height хедера */
}
</style>
