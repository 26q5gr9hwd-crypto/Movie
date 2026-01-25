<template>
  <LavaLampBackground v-if="backgroundType === 'lava-lamp'" />
  
  <!-- Cinematic Background -->
  <div v-else-if="backgroundType === 'cinematic'" class="cinematic-container">
    <div class="cinematic-gradient"></div>
    <div class="cinematic-noise"></div>
    <div class="cinematic-vignette"></div>
    <div class="cinematic-glow cinematic-glow-1"></div>
    <div class="cinematic-glow cinematic-glow-2"></div>
    <div class="cinematic-glow cinematic-glow-3"></div>
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

/* ===== CINEMATIC BACKGROUND - Netflix-inspired ===== */
.cinematic-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: #0d0d0d;
}

/* Main gradient - Netflix-inspired dark with rich undertones */
.cinematic-gradient {
  position: absolute;
  inset: 0;
  background: 
    /* Bottom spotlight - warm red glow from below */
    radial-gradient(ellipse 100% 50% at 50% 105%, rgba(180, 10, 20, 0.25) 0%, transparent 50%),
    /* Left ambient glow */
    radial-gradient(ellipse 60% 80% at -10% 60%, rgba(120, 10, 30, 0.2) 0%, transparent 50%),
    /* Right ambient glow */
    radial-gradient(ellipse 50% 70% at 110% 40%, rgba(80, 5, 20, 0.15) 0%, transparent 50%),
    /* Top subtle blue-ish highlight for depth */
    radial-gradient(ellipse 80% 30% at 50% -5%, rgba(40, 40, 60, 0.3) 0%, transparent 50%),
    /* Base gradient - rich dark with slight warm variation */
    linear-gradient(180deg, 
      #101014 0%, 
      #0e0a0c 25%, 
      #110a0d 50%,
      #0d080a 75%,
      #0a0608 100%
    );
}

/* Film grain noise overlay - subtle texture for cinematic feel */
.cinematic-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Vignette effect - cinematic edge darkening */
.cinematic-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 75% 70% at 50% 50%,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.25) 70%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
}

/* Ambient glow effects - uses CSS variable for accent color */
.cinematic-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  will-change: transform, opacity;
}

/* Primary glow - bottom left, Netflix red accent */
.cinematic-glow-1 {
  width: 900px;
  height: 900px;
  background: radial-gradient(circle, var(--accent-color, #e50914) 0%, transparent 60%);
  bottom: -400px;
  left: -250px;
  opacity: 0.15;
  animation: glowPulse1 15s ease-in-out infinite;
}

/* Secondary glow - top right, deeper red/maroon */
.cinematic-glow-2 {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(150, 20, 50, 0.9) 0%, transparent 60%);
  top: -250px;
  right: -200px;
  opacity: 0.1;
  animation: glowPulse2 18s ease-in-out infinite;
}

/* Tertiary glow - center bottom, subtle warmth */
.cinematic-glow-3 {
  width: 1200px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(229, 9, 20, 0.5) 0%, transparent 70%);
  bottom: -200px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.08;
  animation: glowPulse3 20s ease-in-out infinite;
}

@keyframes glowPulse1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.15;
  }
  33% {
    transform: translate(40px, -20px) scale(1.05);
    opacity: 0.18;
  }
  66% {
    transform: translate(-20px, 10px) scale(0.98);
    opacity: 0.12;
  }
}

@keyframes glowPulse2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.1;
  }
  50% {
    transform: translate(-30px, 25px) scale(1.1);
    opacity: 0.14;
  }
}

@keyframes glowPulse3 {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.08;
  }
  50% {
    transform: translateX(-50%) scale(1.05);
    opacity: 0.12;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .cinematic-glow-1,
  .cinematic-glow-2,
  .cinematic-glow-3 {
    animation: none;
  }
}
</style>
