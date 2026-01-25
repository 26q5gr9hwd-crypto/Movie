<template>
  <div class="wrapper">
    <div class="mainpage">
      <!-- Search Type Buttons -->
      <div class="search-type-buttons">
        <button :class="{ active: searchType === 'title' }" @click="setSearchType('title')">
          Название
        </button>
      </div>

      <!-- Search Input -->
      <div class="search-container">
        <div class="input-wrapper">
          <input
            ref="searchInput"
            v-model="searchTerm"
            :placeholder="getPlaceholder()"
            class="search-input"
            :class="{ 'wrong-layout': showLayoutWarning }"
            inputmode="text"
            @keydown.enter.prevent="search"
            @keydown.tab.prevent="handleTabKey"
            @keydown.down.prevent="focusFirstMovieCard"
            @input="handleInput"
          />
          <div class="icons">
            <button v-if="searchTerm" class="reset-button" @click="resetSearch">
              <i class="fas fa-times"></i>
            </button>
            <button class="search-button" @click="search">
              <i class="fas fa-search"></i>
            </button>
          </div>
          <div v-if="showLayoutWarning" class="layout-warning" :class="{ show: showLayoutWarning }">
            <i class="fas fa-keyboard"></i>
            Возможно, вы используете неправильную раскладку. Нажмите Tab для переключения на
             suggestedLayout  раскладку
          </div>
        </div>
      </div>

      <!-- Content Container -->
      <div class="content-container">
        <!-- History Section (when not searching) -->
        <div v-if="!searchTerm && !searchPerformed">
          <h2>
            История просмотра
            <span v-if="history.length > 0">
              <DeleteButton @click="showModal = true" />
              <BaseModal
                :is-open="showModal"
                message="Вы уверены, что хотите очистить историю?"
                @confirm="clearAllHistory"
                @close="showModal = false"
              />
            </span>
          </h2>
          <div v-if="historyLoading" class="loading-container">
            <SpinnerLoading />
          </div>
          <div v-else-if="history.length === 0" class="empty-history">
            <span class="material-icons">movie</span>
            <p>Здесь пока пусто</p>
          </div>
          <MovieList
            v-else
            :movies-list="history"
            :is-history="true"
            :loading="false"
            @item-deleted="handleItemDeleted"
          />
        </div>

        <!-- Popular Movies Section (when not searching) -->
        <div v-if="!searchTerm && !searchPerformed" class="popular-section">
          <h2>Популярные фильмы</h2>
          <div v-if="popularLoading" class="loading-container">
            <SpinnerLoading />
          </div>
          <div v-else-if="popularMovies.length === 0 && !popularError" class="empty-history">
            <span class="material-icons">movie</span>
            <p>Нет данных</p>
          </div>
          <MovieList
            v-else
            :movies-list="popularMovies"
            :is-history="false"
            :loading="false"
          />
          <ErrorMessage
            v-if="popularError"
            :message="popularError"
          />
        </div>

        <!-- Search Results -->
        <div v-if="searchPerformed">
          <h2>Результаты поиска</h2>
          <MovieList :movies-list="movies" :is-history="false" :loading="searchLoading" />
          <div v-if="movies.length === 0 && !searchLoading && !errorMessage" class="no-results">
            Ничего не найдено
          </div>
          <ErrorMessage v-if="errorMessage" :message="errorMessage" :code="errorCode" />
        </div>

        <!-- Search Prompt -->
        <div
          v-if="searchTerm && !searchPerformed && !searchLoading && !errorMessage"
          class="search-prompt"
        >
          Нажмите кнопку "Поиск" или Enter для поиска
        </div>

        <ErrorMessage
          v-if="!searchTerm && errorMessage"
          :message="errorMessage"
          :code="errorCode"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { apiSearch, getMovies } from '@/api/movies'
import { handleApiError } from '@/constants'
import { getMyLists, delAllFromList } from '@/api/user'
import BaseModal from '@/components/BaseModal.vue'
import DeleteButton from '@/components/buttons/DeleteButton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { MovieList } from '@/components/MovieList/'
import { useMainStore } from '@/store/main'
import { useAuthStore } from '@/store/auth'
import { USER_LIST_TYPES_ENUM } from '@/constants'
import { hasConsecutiveConsonants, suggestLayout, convertLayout } from '@/utils/keyboardLayout'
import debounce from 'lodash/debounce'
import { watchEffect, onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import SpinnerLoading from '@/components/SpinnerLoading.vue'

const mainStore = useMainStore()
const authStore = useAuthStore()
const router = useRouter()

const searchType = ref('title')
const searchTerm = ref('')
const movies = ref([])
const searchLoading = ref(false)
const searchPerformed = ref(false)
const showModal = ref(false)
const errorMessage = ref('')
const errorCode = ref(null)
const isMobile = computed(() => mainStore.isMobile)
const history = ref([])
const historyLoading = ref(false)

// Popular movies state
const popularMovies = ref([])
const popularLoading = ref(false)
const popularError = ref('')

const showLayoutWarning = ref(false)
const suggestedLayout = ref('')

const searchInput = ref(null)

// Fetch popular movies on mount
const fetchPopularMovies = async () => {
  popularLoading.value = true
  popularError.value = ''
  
  try {
    const data = await getMovies({ activeTime: '7d' })
    popularMovies.value = data.map((movie) => ({
      ...movie,
      kp_id: movie.kp_id?.toString() || movie.id?.toString(),
      rating_kp: movie.rating_kp || movie.raw_data?.rating,
      type: movie.type || movie.raw_data?.type
    }))
  } catch (error) {
    const { message } = handleApiError(error)
    popularError.value = message
  } finally {
    popularLoading.value = false
  }
}

// Load history
watchEffect(async () => {
  if (authStore.token) {
    historyLoading.value = true
    try {
      history.value = await getMyLists(USER_LIST_TYPES_ENUM.HISTORY)
    } catch (error) {
      const { message, code } = handleApiError(error)
      errorMessage.value = message
      errorCode.value = code
      if (code === 401) {
        authStore.logout()
        await router.push('/login')
        router.go(0)
      }
    } finally {
      historyLoading.value = false
    }
  } else {
    history.value = mainStore.history
  }
})

function handleItemDeleted(deletedItemId) {
  history.value = history.value.filter((item) => item.kp_id !== deletedItemId)
}

const setSearchType = (type) => {
  searchType.value = type
  resetSearch()
  showLayoutWarning.value = false
}

const handleInput = (event) => {
  errorMessage.value = ''
  errorCode.value = null
  searchTerm.value = event.target.value
  if (isMobile.value) return
  showLayoutWarning.value = hasConsecutiveConsonants(searchTerm.value)
  if (showLayoutWarning.value) {
    suggestedLayout.value = suggestLayout(searchTerm.value)
  }
}

const handleTabKey = () => {
  if (showLayoutWarning.value) {
    searchTerm.value = convertLayout(searchTerm.value)
    showLayoutWarning.value = false
  }
}

const getPlaceholder = () => {
  return 'Введите название фильма'
}

const resetSearch = () => {
  searchTerm.value = ''
  movies.value = []
  searchPerformed.value = false
  showLayoutWarning.value = false
  errorMessage.value = ''
  errorCode.value = null
  searchInput.value?.focus()
}

const search = () => {
  debouncedPerformSearch.cancel()
  if (searchTerm.value) {
    errorMessage.value = ''
    errorCode.value = null
    performSearch()
  }
}

const performSearch = async () => {
  searchLoading.value = true
  searchPerformed.value = true
  movies.value = []

  try {
    const response = await apiSearch(searchTerm.value)
    movies.value = response.map((movie) => ({
      ...movie,
      kp_id: movie.kp_id?.toString() || movie.id?.toString(),
      rating_kp: movie.rating_kp || (movie.raw_data?.rating !== 'null' ? movie.raw_data?.rating : null),
      type: movie.type || movie.raw_data?.type
    }))
  } catch (error) {
    const { message, code } = handleApiError(error)
    errorMessage.value = message
    errorCode.value = code
  } finally {
    searchLoading.value = false
  }
}

const clearAllHistory = async () => {
  historyLoading.value = true
  if (authStore.token) {
    try {
      await delAllFromList(USER_LIST_TYPES_ENUM.HISTORY)
      history.value = []
      historyLoading.value = false
      showModal.value = false
    } catch (error) {
      const { message, code } = handleApiError(error)
      errorMessage.value = message
      errorCode.value = code
      if (code === 401) {
        authStore.logout()
        await router.push('/login')
        router.go(0)
      }
      historyLoading.value = false
      showModal.value = false
    }
  } else {
    mainStore.clearAllHistory()
    historyLoading.value = false
    showModal.value = false
  }
}

const debouncedPerformSearch = debounce(() => {
  if (searchTerm.value.length >= 2) {
    performSearch()
  } else if (searchTerm.value.length < 2) {
    movies.value = []
    searchPerformed.value = false
  }
}, 700)

onMounted(() => {
  fetchPopularMovies()
  
  const hash = window.location.hash
  if (hash.startsWith('#search=')) {
    const searchQuery = decodeURIComponent(hash.replace('#search=', ''))
    searchTerm.value = searchQuery
    performSearch()
  }
  searchInput.value?.focus()
})

watch(searchTerm, () => {
  debouncedPerformSearch()
})

const focusFirstMovieCard = () => {
  if (movies.value.length > 0) {
    const firstMovieCard = document.querySelector('.movie-card')
    if (firstMovieCard) {
      firstMovieCard.focus()
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.mainpage {
  flex: 1;
  padding-top: 20px;
  padding-bottom: 40px;
}

/* Search Type Buttons */
.search-type-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 10px;
  margin-bottom: 5px;
  flex-wrap: wrap;
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
  background-color: var(--accent-color);
}

.search-type-buttons button:hover {
  color: #ffffff;
}

/* Search Container */
.search-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
}

.search-input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-transparent);
}

.search-input.wrong-layout {
  border-color: #ff8c00;
  box-shadow: 0 0 5px rgba(255, 140, 0, 0.2);
}

.icons {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
}

.reset-button,
.search-button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 2px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.reset-button:hover,
.search-button:hover {
  opacity: 1;
}

.reset-button i,
.search-button i {
  font-size: 18px;
  display: block;
  width: 20px;
  height: 20px;
}

/* Section Headers */
h2 {
  display: flex;
  font-size: 20px;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.popular-section {
  margin-top: 40px;
}

/* No Results */
.no-results {
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 18px;
  margin-top: 20px;
}

/* Search Prompt */
.search-prompt {
  text-align: center;
  color: #fff;
  font-size: 18px;
  margin-top: 20px;
}

/* Layout Warning */
.layout-warning {
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  text-align: center;
  color: #ff8c00;
  font-size: 14px;
  background: rgba(255, 140, 0, 0.15);
  padding: 8px 12px;
  border-radius: 5px;
  pointer-events: none;
  border: 1px solid rgba(255, 140, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1;
  backdrop-filter: blur(5px);
}

.layout-warning.show {
  opacity: 1;
  transform: translateY(0);
}

.layout-warning i {
  font-size: 16px;
  color: #ff8c00;
}

/* Loading & Empty States */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #888;
  gap: 15px;
}

.empty-history .material-icons {
  font-size: 64px;
  color: #888;
  opacity: 0.7;
}

.empty-history p {
  font-size: 18px;
  margin: 0;
  color: #888;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .mainpage {
    padding-top: 0;
    height: calc(100vh - 30px - 63px);
  }

  .search-container,
  .search-type-buttons {
    padding: 0;
  }
}
</style>
