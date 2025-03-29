<template>
  <div class="wrapper">
    <div class="top-100-page" tabindex="0">
      <!-- Меню с фильтрами и настройками -->
      <div class="controls">
        <div class="filters">
          <button
            v-for="(button, index) in timeFilters"
            :key="index"
            class="btn btn--primary"
            :class="{ active: activeTimeFilter === button.apiUrl }"
            @click="changeTimeFilter(button.apiUrl)"
          >
            {{ button.label }}
          </button>
        </div>

        <div class="type-filter">
          <div class="custom-select__wrapper">
            <select v-model="typeFilter" class="custom-select" @change="fetchMovies">
              <option value="all">Все</option>
              <option value="movie">Фильмы</option>
              <option value="series">Сериалы</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Контейнер для сетки фильмов и спиннера -->
      <MovieList
        v-if="!errorMessage"
        :movies-list="movies"
        :is-history="false"
        :loading="loading"
      />

      <!-- Компонент ошибки отображается только, если errorMessage не пустой -->
      <ErrorMessage v-if="errorMessage" :message="errorMessage" :code="errorCode" />
    </div>
  </div>
</template>

<script setup>
import { getMovies, handleApiError } from '@/api/movies'
import { MovieList } from '@/components/MovieList'
import { onMounted, ref } from 'vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

// Состояния
const movies = ref([])
const loading = ref(false)
const activeTimeFilter = ref('all')
const typeFilter = ref('all')

// Переменные для ошибок
const errorMessage = ref('')
const errorCode = ref(null)

// Фильтры по времени
const timeFilters = [
  { label: 'Всё время', apiUrl: 'all' },
  { label: '30 дней', apiUrl: '30d' },
  { label: '7 дней', apiUrl: '7d' },
  { label: '24 часа', apiUrl: '24h' }
]

// Функция для получения фильмов
const fetchMovies = async (e) => {
  e?.target?.blur()
  loading.value = true

  // Сброс сообщения об ошибке при новом запросе
  errorMessage.value = ''
  errorCode.value = null

  try {
    movies.value = await getMovies({
      activeTime: activeTimeFilter.value,
      typeFilter: typeFilter.value
    })
  } catch (error) {
    const { message, code } = handleApiError(error)
    errorMessage.value = message
    errorCode.value = code
    console.error('Ошибка при загрузке топа фильмов:', error)
    movies.value = []
  } finally {
    loading.value = false
  }
}

// Функция для изменения фильтра по времени
const changeTimeFilter = (apiUrl) => {
  activeTimeFilter.value = apiUrl
  fetchMovies()
}

onMounted(() => {
  fetchMovies()
})
</script>

<style scoped>
.wrapper {
  display: flex;
  min-height: 100vh;
}

.top-100-page {
  flex: 1;
  padding-top: 20px;
  padding-bottom: 40px;
  max-width: calc(258px * 5);
  margin: 0 auto;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.type-filter {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  max-width: 367.5px;
  width: 100%;
}

@media (max-width: 600px) {
  .top-100-page {
    padding-top: 0;
  }
}
</style>
