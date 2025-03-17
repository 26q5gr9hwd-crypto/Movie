<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const loading = ref(false);
const CACHE_KEY = 'topMoviePoster';

// Функция для получения постера топ-1 фильма
const fetchTopMovie = async () => {
  loading.value = true;
  try {
    const response = await fetch('https://rh.aukus.su/top/24h');
    const data = await response.json();
    if (data?.[0]?.cover) {
      // Передаем URL в хранилище
      store.dispatch('background/updateBackgroundUrl', data[0].cover);

      // Кэшируем ответ до 00:00
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const expiresAt = midnight.getTime();
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        url: data[0].cover,
        expiresAt
      }));
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Проверяем, есть ли действующий кэш
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { url, expiresAt } = JSON.parse(cached);
    if (Date.now() < expiresAt) {
      // Если кэш действителен, отправляем сохранённый URL в хранилище
      store.dispatch('background/updateMovieBackground', url);
      return;
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  }
  // Если кэша нет или он истёк, запрашиваем данные
  fetchTopMovie();
});
</script>