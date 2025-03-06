<template>
  <div class="mainpage">
  <!-- Кнопки выбора типа поиска -->
  <div class="search-type-buttons">
    <button :class="{ active: searchType === 'title' }" @click="setSearchType('title')">
      Название
    </button>
    <button :class="{ active: searchType === 'kinopoisk' }" @click="setSearchType('kinopoisk')">
      ID Кинопоиск
    </button>
    <button :class="{ active: searchType === 'shikimori' }" @click="setSearchType('shikimori')">
      ID Shikimori
    </button>
  </div>

  <!-- Поиск -->
  <div class="search-container">
    <input
      ref="searchInput"
      v-model="searchTerm"
      :placeholder="getPlaceholder()"
      class="search-input"
      @keydown.enter="search"
    />
    <button @click="search" class="search-button">
      <i class="fas fa-search"></i>
    </button>
    <button @click="resetSearch" class="reset-button">Сброс</button>
  </div>

  <!-- Контейнер для истории и результатов -->
  <div class="content-container">

    <!-- История просмотра -->
    <div v-if="!searchTerm && history.length > 0">
      <h2>История просмотра
        <span>
          <button @click="clearAllHistory" class="clear-history-button">
            Очистить
          </button>
        </span>
      </h2>
      <CardsMovie :moviesList="history" :isHistory="true" :loading="loading" />
    </div>

    <!-- Результаты поиска -->
    <div v-if="searchPerformed">
      <h2>Результаты поиска</h2>
      <CardsMovie :moviesList="movies" :isHistory="false" />
      <div v-if="movies.length === 0 && !loading" class="no-results">
        Ничего не найдено
      </div>
    </div>

    <!-- Подсказка, когда ничего не введено в поиске -->
    <div v-if="searchTerm && !searchPerformed && !loading" class="search-prompt">
      Нажмите кнопку "Поиск" или Enter для поиска
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import CardsMovie from "@/components/CardsMovie.vue";
import { useStore } from 'vuex';

const apiUrl = import.meta.env.VITE_APP_API_URL;
const store = useStore(); // История из Vuex
const searchType = ref('title'); // По умолчанию поиск по названию
const searchTerm = ref(''); // Текущий запрос
const movies = ref([]); // Результаты поиска
const loading = ref(false); // Состояние загрузки
const searchPerformed = ref(false); // Флаг, указывающий, был ли выполнен поиск
const router = useRouter(); // Роутер

// Получаем историю из хранилища Vuex
const history = computed(() => store.state.history);

// Установка типа поиска
const setSearchType = (type) => {
  searchType.value = type;
  resetSearch();
};

// Получение плейсхолдера для поля ввода
const getPlaceholder = () => {
  switch (searchType.value) {
    case 'title':
      return 'Введите название фильма';
    case 'kinopoisk':
      return 'Введите ID Кинопоиск';
    case 'shikimori':
      return 'Введите ID Shikimori';
    default:
      return 'Введите название фильма';
  }
};

// Загружаем историю при монтировании компонента
onMounted(() => {
  store.dispatch('loadHistory'); 
});

// Поиск фильма
const search = async () => {
  if (!searchTerm.value) return;

  loading.value = true;
  searchPerformed.value = true;
  movies.value = [];

  try {
    if (searchType.value === 'kinopoisk') {
      if (!/^\d+$/.test(searchTerm.value)) {
        alert('Введите числовой ID Кинопоиска');
        return;
      } else {
        router.push({ 
          name: 'movie-info', 
          params: { kp_id: searchTerm.value } 
        });
        return;
      }
    } else if (searchType.value === 'shikimori') {
      if (!/^\d+$/.test(searchTerm.value)) {
        alert('Введите числовой ID Shikimori');
        return;
      } else {
        router.push({ 
          name: 'movie-info', 
          params: { kp_id: `shiki${searchTerm.value}` } 
        });
        return;
      }
    } else {
      const response = await axios.get(`${apiUrl}/search/${searchTerm.value}`);
      movies.value = response.data.map(movie => ({
        ...movie,
        kp_id: movie.id.toString()
      }));
    }
  } catch (error) {
    console.error('Ошибка:', error);
    if (error.response?.status === 404) {
      movies.value = [];
    }
    router.push(`/${error.response?.status || 500}`);
  } finally {
    loading.value = false;
  }
};

// Сброс поиска
const resetSearch = () => {
  searchTerm.value = '';
  movies.value = [];
  searchPerformed.value = false;
};

const clearAllHistory = () => {
  if (confirm('Вы уверены, что хотите очистить историю?')) {
    store.dispatch('clearAllHistory');  // Вызов действия для очистки истории
  }
};
</script>

<style scoped>
.mainpage{
  padding-top: 20px;
}
/* Общие стили */
.search-type-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
  padding-top: 10px;
}

.search-type-buttons button {
  padding: 5px 10px;
  font-size: 16px;
  border: none;
  background: none;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.search-type-buttons button::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.search-type-buttons button.active::after {
  background-color: #ffffff;
}

.search-type-buttons button:hover {
  color: #ffffff;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 0px 20px 20px 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  max-width: 800px;
}

.search-input:focus {
  border: 1px solid #558839;
}

.search-button {
  padding: 10px;
  font-size: 16px;
  border: none;
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid #ccc;
}

.search-button:hover {
  background-color: #464646;
}

.reset-button {
  padding: 10px;
  font-size: 16px;
  border: none;
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #ccc;
}

.reset-button:hover {
  background-color: #464646;
}

h2 {
  display: flex;
  font-size: 20px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

/* Сообщение "Ничего не найдено" */
.no-results {
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 18px;
  margin-top: 20px;
}

/* Подсказка для поиска */
.search-prompt {
  text-align: center;
  color: #fff;
  font-size: 18px;
  margin-top: 20px;
}

.clear-history-button {
  padding: 10px;
  font-size: 20px;
  border: none;
  background: rgba(255, 0, 0, 0.2);
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid #ccc;
}

.clear-history-button:hover {
  background-color: #ff0000;
}

@media (max-width: 600px) {
  .mainpage{
    padding-top: 70px;
  }
}
</style>