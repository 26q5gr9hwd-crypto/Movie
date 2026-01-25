<template>
  <LavaLampBackground v-if="backgroundType === 'lava-lamp'" />
  
  <!-- Cinematic Background -->
  <div v-else-if="backgroundType === 'cinematic'" class="cinematic-container">
    <div class="cinematic-gradient"></div>
    <div class="cinematic-noise"></div>
    <div class="cinematic-vignette"></div>
    <div class="cinematic-glow cinematic-glow-1"></div>
    <div class="cinematic-glow cinematic-glow-2"></div>
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
  transition:
    filter 0.6s ease-in-out,
    opacity 0.6s ease-in-out;
  background-size: cover;
  background-position: center;
  will-change: opacity, filter;
}

.background-layer.active {
  opacity: 1;
}

/* ===== CINEMATIC BACKGROUND ===== */
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

/* Main gradient - deep cinematic blacks with subtle red undertones */
.cinematic-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 120% 80% at 50% 100%, rgba(20, 5, 5, 0.9) 0%, transparent 60%),
    radial-gradient(ellipse 80% 60% at 0% 50%, rgba(30, 5, 10, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 100% 50%, rgba(20, 5, 15, 0.5) 0%, transparent 50%),
    linear-gradient(180deg, 
      #050505 0%, 
      #0a0508 20%, 
      #0d0609 40%,
      #0a0507 60%,
      #080406 80%,
      #050303 100%
    );
}

/* Film grain noise overlay */
.cinematic-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;
  background-image:
    repeating-radial-gradient(
      circle at 0 0,
      rgba(255, 255, 255, 0.15) 0,
      rgba(255, 255, 255, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
  background-size: 3px 3px;
}

/* Vignette effect - darker edges like cinema */
.cinematic-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 60% at 50% 50%,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
}

/* Subtle ambient glow animations */
.cinematic-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
  will-change: transform, opacity;
}

.cinematic-glow-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(229, 9, 20, 0.4) 0%, transparent 70%);
  bottom: -200px;
  left: -100px;
  animation: glowPulse1 12s ease-in-out infinite;
}

.cinematic-glow-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 0, 50, 0.3) 0%, transparent 70%);
  top: -150px;
  right: -100px;
  animation: glowPulse2 15s ease-in-out infinite;
}

@keyframes glowPulse1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.15;
  }
  50% {
    transform: translate(50px, -30px) scale(1.1);
    opacity: 0.2;
  }
}

@keyframes glowPulse2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.12;
  }
  50% {
    transform: translate(-40px, 20px) scale(1.15);
    opacity: 0.18;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .cinematic-glow-1,
  .cinematic-glow-2 {
    animation: none;
  }
}
</style>
