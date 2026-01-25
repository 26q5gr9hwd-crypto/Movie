<template>
  <transition name="slide">
    <nav v-if="isNavbarVisible" class="mobile-navbar" @click.stop>
      <div class="mobile-header">
        <router-link to="/" class="mobile-logo" @click="closeNavbar">
          <img
            src="@/assets/basedge.png"
            alt="DanFlix"
            class="logo-image"
          />
          <span class="logo-text">DanFlix</span>
        </router-link>
      </div>

      <div class="nav-links-wrapper">
        <ul class="nav-links">
          <li v-for="link in props.links" :key="link.text">
            <!-- Notification badge link -->
            <template v-if="link.component === 'NotificationBadge'">
              <router-link
                :to="link.to"
                :exact="link.exact"
                class="nav-link"
                @click="closeNavbar"
              >
                <div class="nav-icon">
                  <NotificationBadge />
                </div>
                <span class="nav-text">{{ link.text }}</span>
              </router-link>
            </template>

            <!-- Normal link -->
            <component
              v-else
              :is="link.to ? 'router-link' : 'a'"
              v-bind="
                link.to
                  ? { to: link.to, exact: link.exact }
                  : { href: link.href, target: '_blank' }
              "
              class="nav-link"
              @click="closeNavbar"
            >
              <div class="nav-icon">
                <template
                  v-if="
                    typeof link.icon === 'string' &&
                    link.icon.startsWith('fa')
                  "
                >
                  <i :class="link.icon"></i>
                </template>

                <template
                  v-else-if="
                    typeof link.icon === 'string' &&
                    link.icon.startsWith('http')
                  "
                >
                  <img
                    :src="link.icon"
                    alt="icon"
                    class="icon-user"
                  />
                </template>

                <template v-else>
                  <img
                    src="@/assets/icon-donut.png"
                    alt="icon"
                    class="icon-donut"
                  />
                </template>
              </div>

              <span class="nav-text">{{ link.text }}</span>
            </component>
          </li>
        </ul>
      </div>
    </nav>
  </transition>

  <div
    v-if="isNavbarVisible"
    class="overlay"
    @click="closeNavbar"
  ></div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useNavbarStore } from '@/store/navbar'
import NotificationBadge from '@/components/notification/NotificationBadge.vue'

const props = defineProps({
  links: Array
})

const navbarStore = useNavbarStore()
const { isNavbarVisible } = storeToRefs(navbarStore)
const { closeNavbar } = navbarStore
</script>

<style scoped>
.mobile-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: var(--bg-secondary);
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
}

.mobile-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-image {
  height: 40px;
  width: 40px;
  object-fit: contain;
  border-radius: 10px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  letter-spacing: -0.02em;
}

.nav-links-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 14px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon i {
  font-size: 18px;
}

.nav-text {
  font-size: 15px;
  font-weight: 500;
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

.icon-user {
  height: 24px;
  width: 24px;
  object-fit: cover;
  border-radius: 50%;
}

.icon-donut {
  height: 24px;
  width: 24px;
  object-fit: contain;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 99;
}
</style>
</tr>
