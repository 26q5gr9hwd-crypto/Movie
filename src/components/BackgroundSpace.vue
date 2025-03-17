<template>
  <div v-if="backgroundType !== 'disabled'" class="background-container">
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;
const store = useStore();
const route = useRoute();
const router = useRouter();

const backgrounds = ref(['', '']);
const activeIndex = ref(0);

const backgroundUrl = computed(() => store.getters['background/getBackgroundUrl']);
const backgroundType = computed(() => store.getters['background/getBackgroundType']);
const isBlurActive = computed(() => store.getters['background/isBlurActive']);
console.log(backgroundUrl)

const CACHE_KEY = 'topMoviePoster';

const getLayerStyle = (index) => {
  // При типе 'stars' затемнение заменяется на brightness(100%) (то есть без затемнения)
  const brightnessFilter = backgroundType.value === 'stars' ? 'brightness(100%)' : 'brightness(20%)';
  // Используем blur(0px) вместо пустой строки для плавного перехода
  const blurFilter = isBlurActive.value ? 'blur(20px)' : 'blur(0px)';
  // Собираем строку фильтров
  const filters = [brightnessFilter, blurFilter].join(' ');
  
  return {
    backgroundImage: `url(${backgrounds.value[index]})`,
    filter: filters,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
};


const fetchTopMovie = async () => {
  try {
    const response =  await axios.get(`${apiUrl}/top/24h`);
    
    if (response?.[0]?.cover) {
      const expiresAt = new Date().setHours(24, 0, 0, 0);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ url: response[0].cover, expiresAt }));
      store.dispatch('background/updateTopMoviePoster', response[0].cover);
      return response[0].cover;
    }
  } catch (err) {
    console.error('Ошибка:', err);
  }
};

const checkCachedTopMovie = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { url, expiresAt } = JSON.parse(cached);
    if (Date.now() < expiresAt) {
      store.dispatch('background/updateTopMoviePoster', url);
      console.log('Используем кэшированный постер:', url);
      return true;
    }
    localStorage.removeItem(CACHE_KEY);
    console.log('Удален устаревший кэш');
  }
  return false;
};

onMounted(async () => {
  // ждем
  backgrounds.value = [backgroundUrl.value, backgroundUrl.value];
  await router.isReady();
  // Если путь роутинга содержит 'movie', не инициируем загрузку фона
  if (route.path.includes('movie')) return;

  if (backgroundType.value !== 'disabled') {
    const hasValidCache = checkCachedTopMovie();
    if (!hasValidCache) {
      fetchTopMovie();
    }
  }
});

watch(route, (newRoute) => {
  // Если новый путь содержит 'movie', не обновляем фон
  if (newRoute.path.includes('movie')) return;
  
  if (backgroundType.value === 'dynamic') {
    const hasValidCache = checkCachedTopMovie();
    if (!hasValidCache) {
      fetchTopMovie();
    }
  }
});

watch(backgroundUrl, (newUrl, oldUrl) => {
  if (!newUrl) return;
  console.log('Фон изменился:', oldUrl, '→', newUrl);
  
  // Создаем новый Image объект
  const img = new Image();
  img.src = newUrl;
  img.onload = () => {
    // Когда изображение загружено, меняем фон
    const inactiveIndex = activeIndex.value === 0 ? 1 : 0;
    backgrounds.value[inactiveIndex] = newUrl;
    
    // Активируем новый фон
    activeIndex.value = inactiveIndex;
  };
});
</script>

<style scoped>
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
</style>
