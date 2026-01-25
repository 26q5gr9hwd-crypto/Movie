<template>
  <LavaLampBackground v-if="backgroundType === 'lava-lamp'" />
  
  <!-- Dynamic Background - switches between cinematic glow and movie backdrop -->
  <div v-else-if="backgroundType === 'dynamic'" class="dynamic-container">
    <!-- Cinematic Glow (always present as base layer, fades when backdrop is active) -->
    <div class="cinematic-layer" :class="{ 'cinematic-hidden': isOnMoviePage && hasMoviePoster }">
      <div class="cinematic-glow-wrap">
        <div class="cinematic-glow cinematic-glow-1"></div>
        <div class="cinematic-glow cinematic-glow-2"></div>
        <div class="cinematic-glow cinematic-glow-3"></div>
      </div>
      <div class="cinematic-vignette"></div>
    </div>
    
    <!-- Movie Backdrop (shown when on movie page with poster) -->
    <div class="backdrop-layer" :class="{ 'backdrop-active': isOnMoviePage && hasMoviePoster }">
      <div
        v-for="(bg, index) in backgrounds"
        :key="index"
        class="background-image"
        :class="{ active: activeIndex === index }"
        :style="getBackdropStyle(index)"
      ></div>
      <div class="backdrop-vignette"></div>
    </div>
  </div>
  
  <!-- Stars Background -->
  <div v-else-if="backgroundType === 'stars'" class="background-container">
    <div
      class="background-layer active"
      :style="{ backgroundImage: 'url(' + starsBackground + ')', filter: 'brightness(100%)' }"
    ></div>
  </div>
</template>

<script setup>
import LavaLampBackground from './LavaLampBackground.vue'
import starsBackground from '@/assets/image-back-stars.png'
import { useBackgroundStore } from '@/store/background'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const backgroundStore = useBackgroundStore()
const route = useRoute()

const backgrounds = ref(['', ''])
const activeIndex = ref(0)

const backgroundUrl = computed(() => backgroundStore.backgroundUrl)
const backgroundType = computed(() => backgroundStore.backgroundType)
const isBlurActive = computed(() => backgroundStore.isBlurActive)
const moviePoster = computed(() => backgroundStore.moviePoster)

// Check if currently on a movie page
const isOnMoviePage = computed(() => {
  return route.path.includes('/movie/')
})

// Check if we have a movie poster to show
const hasMoviePoster = computed(() => {
  return !!moviePoster.value && moviePoster.value.length > 0
})

const getBackdropStyle = (index) => {
  return {
    backgroundImage: backgrounds.value[index] ? 'url(' + backgrounds.value[index] + ')' : 'none',
    filter: 'brightness(25%) ' + (isBlurActive.value ? 'blur(8px)' : 'blur(0px)'),
    backgroundSize: 'cover',
    backgroundPosition: 'center top'
  }
}

onMounted(() => {
  if (backgroundUrl.value) {
    backgrounds.value = [backgroundUrl.value, backgroundUrl.value]
  }
})

// Watch for route changes - delay clearing poster for smooth transition
watch(
  () => route.path,
  (newPath) => {
    if (!newPath.includes('/movie/')) {
      // Delay clearing to allow cinematic glow to fade in first
      setTimeout(() => {
        if (!route.path.includes('/movie/')) {
          backgroundStore.clearMoviePoster()
        }
      }, 600)
    }
  }
)

// Smooth crossfade when background URL changes (on movie pages)
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
</script>

<style scoped>
/* ===== BASE CONTAINER ===== */
.dynamic-container,
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: #0a0a0a;
}

/* ===== CINEMATIC GLOW LAYER ===== */
.cinematic-layer {
  position: absolute;
  inset: 0;
  transition: opacity 0.6s ease-in-out;
}

.cinematic-layer.cinematic-hidden {
  opacity: 0;
}

.cinematic-glow-wrap {
  filter: blur(80px);
  height: 100%;
  width: 100%;
}

.cinematic-glow {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  background: var(--accent-color, #e50914);
}

.cinematic-glow-1 {
  width: 45vw;
  height: 45vw;
  bottom: -10vw;
  left: -5vw;
  animation: cinematicDrift1 30s ease-in-out infinite;
}

.cinematic-glow-2 {
  width: 35vw;
  height: 35vw;
  top: -8vw;
  right: -5vw;
  opacity: 0.4;
  background: var(--accent-hover, #b20710);
  animation: cinematicDrift2 25s ease-in-out infinite;
}

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

/* ===== MOVIE BACKDROP LAYER ===== */
.backdrop-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  pointer-events: none;
}

.backdrop-layer.backdrop-active {
  opacity: 1;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease-in-out, filter 0.6s ease-in-out;
  background-size: cover;
  background-position: center top;
  will-change: opacity, filter;
}

.background-image.active {
  opacity: 1;
}

.backdrop-vignette {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(to bottom, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.6) 70%, rgba(10, 10, 10, 0.95) 100%),
    linear-gradient(to right, rgba(10, 10, 10, 0.5) 0%, transparent 30%, transparent 70%, rgba(10, 10, 10, 0.5) 100%);
  pointer-events: none;
}

/* ===== STARS BACKGROUND ===== */
.background-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.background-layer.active {
  opacity: 1;
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .cinematic-glow-1,
  .cinematic-glow-2,
  .cinematic-glow-3 {
    animation: none;
  }
  
  .background-image,
  .cinematic-layer,
  .backdrop-layer {
    transition-duration: 0.1s;
  }
}
</style>
