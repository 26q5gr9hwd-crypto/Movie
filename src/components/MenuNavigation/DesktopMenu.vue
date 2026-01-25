<template>
  <aside ref="sidebar" class="side-panel">
    <div class="top-section">
      <router-link to="/" class="home-link" title="DanFlix">
        <span class="brand-logo">DanFlix</span>
      </router-link>
    </div>

    <nav class="side-nav">
      <ul class="nav-links">
        <li
          v-for="(link, idx) in props.links"
          :key="link.text"
          @pointerenter="showTooltip(idx, $event)"
          @pointerleave="hideTooltip"
        >
          <template v-if="link.component === 'NotificationBadge'">
            <router-link
              :to="link.to"
              :exact="link.exact"
              class="nav-link"
              :title="link.text"
            >
              <NotificationBadge />
            </router-link>
          </template>

          <component
            :is="link.to ? 'router-link' : 'a'"
            v-else
            v-bind="
              link.to ? { to: link.to, exact: link.exact } : { href: link.href, target: '_blank' }
            "
            class="nav-link"
            :title="link.text"
          >
            <template v-if="typeof link.icon === 'string' && link.icon.startsWith('fa')">
              <i :class="link.icon"></i>
            </template>
            <template v-else-if="typeof link.icon === 'string' && link.icon.startsWith('http')">
              <img :src="link.icon" alt="icon" class="icon-user" />
            </template>
            <template v-else>
              <img src="@/assets/icon-donut.png" alt="icon" class="icon-donut" />
            </template>
          </component>
        </li>

        <li
          v-if="route.name !== 'home' && props.links.length > 0"
          @pointerenter="showTooltip(links.length, $event)"
          @pointerleave="hideTooltip"
        >
          <a class="nav-link" title="Поиск" @click="toggleSearch">
            <i class="fas fa-search"></i>
          </a>
        </li>
      </ul>

      <div v-if="canGoBack" class="bottom-section">
        <button class="back-btn" title="Назад" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </button>
      </div>
    </nav>

    <div v-if="activeTooltip !== null" class="tooltip" :style="tooltipStyle">
       tooltipText 
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNavbarStore } from '@/store/navbar'
import NotificationBadge from '@/components/notification/NotificationBadge.vue'

const props = defineProps({
  links: Array
})

const route = useRoute()
const router = useRouter()
const navbarStore = useNavbarStore()
const sidebar = ref(null)

const internalNavigationHistory = ref([])
const isNavigatingBack = ref(false)

// Tooltip state
const tooltipPosition = ref({ x: 0, y: 0 })
const activeTooltip = ref(null)
const tooltipText = computed(() => {
  if (activeTooltip.value === null) return ''
  if (activeTooltip.value === props.links.length) return 'Поиск'
  return props.links[activeTooltip.value]?.text || ''
})
let tooltipTimeout = null
let tooltipEvent = null

const showTooltip = (index, event) => {
  tooltipEvent = event
  if (tooltipTimeout) clearTimeout(tooltipTimeout)

  tooltipTimeout = setTimeout(() => {
    if (tooltipEvent) {
      activeTooltip.value = index
      const rect = tooltipEvent.target.getBoundingClientRect()
      tooltipPosition.value = {
        x: rect.right + 12,
        y: rect.top + rect.height / 2
      }
    }
    tooltipTimeout = null
  }, 200)
}

const hideTooltip = () => {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
    tooltipTimeout = null
  }
  activeTooltip.value = null
  tooltipEvent = null
}

const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.x}px`,
  top: `${tooltipPosition.value.y}px`,
  transform: 'translateY(-50%)'
}))

const toggleSearch = () => {
  navbarStore.openSearchModal()
}

const canGoBack = computed(() => {
  return internalNavigationHistory.value.length > 1
})

const goBack = () => {
  if (internalNavigationHistory.value.length > 1) {
    isNavigatingBack.value = true
    internalNavigationHistory.value.pop()
    const previousRoute = internalNavigationHistory.value[internalNavigationHistory.value.length - 1]
    router.replace(previousRoute)
  }
}

const updateNavigationHistory = (to) => {
  if (isNavigatingBack.value) {
    isNavigatingBack.value = false
    return
  }

  if (
    internalNavigationHistory.value.length === 0 ||
    internalNavigationHistory.value[internalNavigationHistory.value.length - 1] !== to.fullPath
  ) {
    internalNavigationHistory.value.push(to.fullPath)
    if (internalNavigationHistory.value.length > 50) {
      internalNavigationHistory.value.shift()
    }
  }
}

onMounted(() => {
  if (route.fullPath) {
    internalNavigationHistory.value.push(route.fullPath)
  }
})

onBeforeUnmount(() => {
  if (tooltipTimeout) clearTimeout(tooltipTimeout)
})

watch(
  route,
  (to) => {
    updateNavigationHistory(to)
  },
  { immediate: false }
)
</script>

<style lang="scss" scoped>
.side-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--nav-width, 64px);
  height: 100vh;
  background: linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  padding: 16px 0;
  z-index: 10;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.top-section {
  margin-bottom: 32px;
  padding: 8px 0;
}

.home-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.brand-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 0.9rem;
  color: var(--accent-color);
  letter-spacing: 1px;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  transition: text-shadow 0.3s ease;
}

.brand-logo:hover {
  text-shadow: 0 0 20px var(--accent-semi-transparent);
}

.side-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nav-links li {
  width: 100%;
  display: flex;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.nav-link i {
  font-size: 18px;
}

.nav-link:hover {
  background: var(--accent-transparent);
  color: var(--accent-color);
}

.nav-link:active,
.nav-link.router-link-active {
  background: var(--accent-transparent);
  color: var(--accent-color);
}

.nav-link.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--accent-color);
  border-radius: 0 3px 3px 0;
}

.icon-user {
  height: 24px;
  width: 24px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.nav-link:hover .icon-user,
.nav-link.router-link-active .icon-user {
  border-color: var(--accent-color);
}

.icon-donut {
  height: 24px;
  width: 24px;
  object-fit: contain;
}

.bottom-section {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  color: var(--accent-color);
  background: var(--accent-transparent);
}

.tooltip {
  position: fixed;
  background: var(--bg-tertiary);
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
}
</style>
