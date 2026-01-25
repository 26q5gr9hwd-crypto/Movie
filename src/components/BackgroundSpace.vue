<template>
  <LavaLampBackground v-if="backgroundType === 'lava-lamp'" />
  
  <!-- Cinematic Background -->
  <div v-else-if="backgroundType === 'cinematic'" class="cinematic-container">
    <div class="cinematic-glow-wrap">
      <div class="cinematic-glow cinematic-glow-1"></div>
      <div class="cinematic-glow cinematic-glow-2"></div>
      <div class="cinematic-glow cinematic-glow-3"></div>
    </div>
    <div class="cinematic-vignette"></div>
  </div>
  
  <!-- Dynamic/Stars Background -->
  <div v-else-if="backgroundType !== 'disabled'" class="background-container">
    <div
      v-for="(bg, index) in backgrounds"
      :key="index"
      class="background-layer"
      :class="{ active: activeIndex === index }"
      :style="getLayerStyle(index)"
    ></div>
  </div>
</template>

<script setup>
import LavaLampBackground from './LavaLampBackground.vue'
import { getMovies } from '@/api/movies'
import { useBackgroundStore } from '@/store/background'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const backgroundStore = useBackgroundStore()
const route = useRoute()
const router = useRouter()

const backgrounds = ref(['', ''])
const activeIndex = ref(0)
const isFetching = ref(false)

const backgroundUrl = computed(() => backgroundStore.backgroundUrl)
const backgroundType = computed(() => backgroundStore.backgroundType)
const isBlurActive = computed(() => backgroundStore.isBlurActive)

const CACHE_KEY = 'topMoviePoster'

const getLayerStyle = (index) => {
  const brightnessFilter = backgroundType.value === 'stars' ? 'brightness(100%)' : 'brightness(20%)'
  const blurFilter = isBlurActive.value ? 'blur(20px)' : 'blur(0px)'

  return {
    backgroundImage: `url(${backgrounds.value[index]})`,
    filter: `${brightnessFilter} ${blurFilter}`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

const fetchTopMovie = async () => {
  if (isFetching.value) return
  isFetching.value = true

  try {
    const topMovies = await getMovies({ activeTime: '24h', limit: 1 })

    if (topMovies?.[0]?.cover) {
      const expiresAt = new Date().setHours(24, 0, 0, 0)
      localStorage.setItem(CACHE_KEY, JSON.stringify({ url: topMovies[0].cover, expiresAt }))
      backgroundStore.updateTopMoviePoster(topMovies[0].cover)
    }
  } catch (err) {
    console.error('Ошибка:', err)
  } finally {
    isFetching.value = false
  }
}

const checkCachedTopMovie = () => {
  const cached = localStorage.getItem(CACHE_KEY)
  if (!cached) return false

  try {
    const { url, expiresAt } = JSON.parse(cached)
    if (Date.now() < expiresAt) {
      backgroundStore.updateTopMoviePoster(url)
      return true
    }
    localStorage.removeItem(CACHE_KEY)
  } catch (e) {
    localStorage.removeItem(CACHE_KEY)
    throw new Error(e)
  }
  return false
}

onMounted(async () => {
  backgrounds.value = [backgroundUrl.value, backgroundUrl.value]
  await router.isReady()

  if (route.path.includes('movie')) return

  if (backgroundType.value !== 'disabled' && backgroundType.value !== 'cinematic') {
    const hasValidCache = checkCachedTopMovie()
    if (!hasValidCache && !isFetching.value) {
      await fetchTopMovie()
    }
  }
})

watch(route, async (newRoute) => {
  if (newRoute.path.includes('movie')) return

  if (backgroundType.value === 'dynamic') {
    const hasValidCache = checkCachedTopMovie()
    if (!hasValidCache && !isFetching.value) {
      await fetchTopMovie()
    }
  }
})

watch(backgroundUrl, (newUrl) => {
  if (!newUrl) return

  const img = new Image()
  img.src = newUrl
  img.onload = () => {
    const inactiveIndex = activeIndex.value ^ 1
    backgrounds.value[inactiveIndex] = newUrl
    activeIndex.value = inactiveIndex
  }
})

watch(backgroundType, (newType) => {
  if (newType === 'dynamic') {
    const hasValidCache = checkCachedTopMovie()
    if (!hasValidCache && !isFetching.value) {
      fetchTopMovie()
    }
  }
})
</script>

<style scoped>
/* ===== DYNAMIC/STARS BACKGROUND ===== */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.background-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: filter 0.6s ease-in-out, opacity 0.6s ease-in-out;
  background-size: cover;
  background-position: center;
  will-change: opacity, filter;
}

.background-layer.active {
  opacity: 1;
}

/* ===== CINEMATIC BACKGROUND - Netflix style ===== */
.cinematic-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: #0a0a0a;
}

/* Blur wrapper - same technique as lava lamp */
.cinematic-glow-wrap {
  filter: blur(80px);
  height: 100%;
  width: 100%;
}

/* Glow elements - solid colors with high opacity like lava lamp */
.cinematic-glow {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  background: var(--accent-color, #e50914);
}

/* Primary glow - bottom left */
.cinematic-glow-1 {
  width: 45vw;
  height: 45vw;
  bottom: -10vw;
  left: -5vw;
  animation: cinematicDrift1 30s ease-in-out infinite;
}

/* Secondary glow - top right, darker shade */
.cinematic-glow-2 {
  width: 35vw;
  height: 35vw;
  top: -8vw;
  right: -5vw;
  opacity: 0.4;
  background: var(--accent-hover, #b20710);
  animation: cinematicDrift2 25s ease-in-out infinite;
}

/* Tertiary glow - center area, deep red */
.cinematic-glow-3 {
  width: 30vw;
  height: 30vw;
  top: 35vh;
  left: 35vw;
  opacity: 0.25;
  background: #6b0f1a;
  animation: cinematicDrift3 35s ease-in-out infinite;
}

@keyframes cinematicDrift1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(8vw, -5vh); }
}

@keyframes cinematicDrift2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-6vw, 6vh); }
}

@keyframes cinematicDrift3 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(10vw, 8vh); }
  66% { transform: translate(-8vw, 4vh); }
}

/* Vignette - darker edges for cinema feel */
.cinematic-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 85% 85% at 50% 50%,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .cinematic-glow-1,
  .cinematic-glow-2,
  .cinematic-glow-3 {
    animation: none;
  }
}
</style>
