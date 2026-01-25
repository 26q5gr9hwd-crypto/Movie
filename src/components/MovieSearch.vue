<template>
  <div class="wrapper">
    <div class="mainpage">
      <!-- Hero Section with Featured Movie -->
      <section v-if="!searchTerm && !searchPerformed && featuredMovie" class="hero-section">
        <img 
          v-if="featuredMovie.backdrop || featuredMovie.cover" 
          :src="featuredMovie.backdrop || featuredMovie.cover" 
          :alt="featuredMovie.title || featuredMovie.name"
          class="hero-backdrop"
        />
        <div class="hero-gradient"></div>
        <div class="hero-content">
          <h1 class="hero-title"> featuredMovie.title || featuredMovie.name </h1>
          <div class="hero-meta">
            <span v-if="featuredMovie.rating_kp" class="hero-rating">★  featuredMovie.rating_kp.toFixed(1) </span>
            <span v-if="featuredMovie.year" class="hero-year"> featuredMovie.year </span>
            <span v-if="featuredMovie.type" class="hero-type"> getTypeLabel(featuredMovie.type) </span>
          </div>
          <p v-if="featuredMovie.raw_data?.description" class="hero-description">
             featuredMovie.raw_data.description 
          </p>
          <div class="hero-buttons">
            <router-link 
              :to="{ name: 'movie-info', params: { kp_id: featuredMovie.kp_id } }" 
              class="hero-btn hero-btn-primary"
            >
              <i class="fas fa-play"></i> Смотреть
            </router-link>
            <router-link 
              :to="{ name: 'movie-info', params: { kp_id: featuredMovie.kp_id } }" 
              class="hero-btn hero-btn-secondary"
            >
              <i class="fas fa-info-circle"></i> Подробнее
            </router-link>
          </div>
        </div>
      </section>

      <!-- Search Section (visible when searching or no hero) -->
      <div v-if="searchTerm || searchPerformed || !featuredMovie" class="search-section">
        <div class="search-type-buttons">
          <button :class="{ active: searchType === 'title' }" @click="setSearchType('title')">
            Название
          </button>
        </div>

        <div class="search-container">
          <div class="input-wrapper">
            <div class="search-pill">
              <i class="fas fa-search search-icon"></i>
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
              <button v-if="searchTerm" class="reset-button" @click="resetSearch">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-if="showLayoutWarning" class="layout-warning" :class="{ show: showLayoutWarning }">
              <i class="fas fa-keyboard"></i>
              Возможно, вы используете неправильную раскладку. Нажмите Tab для переключения на
               suggestedLayout  раскладку
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Search Button (when hero is visible) -->
      <button 
        v-if="!searchTerm && !searchPerformed && featuredMovie" 
        class="floating-search-btn"
        @click="focusSearch"
      >
        <i class="fas fa-search"></i>
      </button>

      <!-- Content Container -->
      <div class="content-container">
        <!-- Popular Movies Section (horizontal carousel on home) -->
        <div v-if="!searchTerm && !searchPerformed" class="movie-row">
          <div class="row-header">
            <h2 class="row-title">🔥 Популярные сейчас</h2>
            <router-link to="/top" class="row-see-all">
              Смотреть все <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
          <div v-if="popularLoading" class="loading-container">
            <SpinnerLoading />
          </div>
          <MovieList
            v-else-if="popularMovies.length > 0"
            :movies-list="popularMovies"
            :is-history="false"
            :loading="false"
            :is-carousel="true"
            :carousel-limit="15"
          />
          <ErrorMessage v-if="popularError" :message="popularError" />
        </div>

        <!-- History Section (horizontal carousel) -->
        <div v-if="!searchTerm && !searchPerformed && history.length > 0" class="movie-row">
          <div class="row-header">
            <h2 class="row-title">
              📺 Продолжить просмотр
            </h2>
            <span class="row-actions">
              <DeleteButton @click="showModal = true" />
              <BaseModal
                :is-open="showModal"
                message="Вы уверены, что хотите очистить историю?"
                @confirm="clearAllHistory"
                @close="showModal = false"
              />
            </span>
          </div>
          <div v-if="historyLoading" class="loading-container">
            <SpinnerLoading />
          </div>
          <MovieList
            v-else
            :movies-list="history"
            :is-history="true"
            :loading="false"
            :is-carousel="true"
            :carousel-limit="10"
            @item-deleted="handleItemDeleted"
          />
        </div>

        <!-- Empty History State -->
        <div v-if="!searchTerm && !searchPerformed && history.length === 0 && !historyLoading" class="empty-history-notice">
          <div class="empty-history-content">
            <span class="material-icons">history</span>
            <p>История просмотров пуста</p>
            <span class="empty-history-hint">Начните смотреть, чтобы видеть историю здесь</span>
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchPerformed" class="search-results-section">
          <h2 class="section-title">Результаты поиска</h2>
          <MovieList :movies-list="movies" :is-history="false" :loading="searchLoading" />
          <div v-if="movies.length === 0 && !searchLoading && !errorMessage" class="no-results">
            <span class="material-icons">search_off</span>
            <p>Ничего не найдено</p>
          </div>
          <ErrorMessage v-if="errorMessage" :message="errorMessage" :code="errorCode" />
        </div>

        <!-- Search Prompt -->
        <div
          v-if="searchTerm && !searchPerformed && !searchLoading && !errorMessage"
          class="search-prompt"
        >
          <i class="fas fa-arrow-up"></i>
          Нажмите Enter для поиска
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

// Popular movies for carousel
const popularMovies = ref([])
const popularLoading = ref(false)
const popularError = ref('')

// Featured movie for hero section
const featuredMovie = computed(() => {
  if (popularMovies.value.length > 0) {
    // Pick a random high-rated movie from top 5
    const topMovies = popularMovies.value
      .filter(m => m.rating_kp >= 7 && (m.backdrop || m.cover))
      .slice(0, 5)
    if (topMovies.length > 0) {
      return topMovies[Math.floor(Math.random() * topMovies.length)]
    }
    return popularMovies.value[0]
  }
  return null
})

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
      type: movie.type || movie.raw_data?.type,
      backdrop: movie.raw_data?.backdrop?.url || movie.raw_data?.poster?.url
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
  return 'Поиск фильмов и сериалов...'
}

const resetSearch = () => {
  searchTerm.value = ''
  movies.value = []
  searchPerformed.value = false
  showLayoutWarning.value = false
  errorMessage.value = ''
  errorCode.value = null
}

const focusSearch = () => {
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
  padding-bottom: 40px;
}

/* Hero Section */
.hero-section {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 500px;
  max-height: 800px;
  margin-bottom: 30px;
  overflow: hidden;
}

.hero-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(20, 20, 20, 0) 0%,
    rgba(20, 20, 20, 0.4) 50%,
    rgba(20, 20, 20, 0.9) 80%,
    var(--bg-primary) 100%
  ),
  linear-gradient(
    to right,
    rgba(20, 20, 20, 0.9) 0%,
    rgba(20, 20, 20, 0.4) 30%,
    rgba(20, 20, 20, 0) 60%
  );
}

.hero-content {
  position: absolute;
  bottom: 15%;
  left: 5%;
  max-width: 550px;
  z-index: 2;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  line-height: 1.1;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 1rem;
  color: var(--text-secondary);
}

.hero-rating {
  color: var(--success-color);
  font-weight: 600;
}

.hero-description {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
}

.hero-buttons {
  display: flex;
  gap: 12px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.hero-btn-primary {
  background: #fff;
  color: #141414;
}

.hero-btn-primary:hover {
  background: rgba(255, 255, 255, 0.85);
}

.hero-btn-secondary {
  background: rgba(109, 109, 110, 0.7);
  color: #fff;
}

.hero-btn-secondary:hover {
  background: rgba(109, 109, 110, 0.5);
}

/* Floating Search */
.floating-search-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-search-btn:hover {
  background: var(--accent-color);
  border-color: var(--accent-color);
  transform: scale(1.1);
}

/* Search Section */
.search-section {
  padding: 20px 4%;
}

.search-type-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.search-type-buttons button {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
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

.search-type-buttons button.active {
  color: var(--text-color);
}

.search-type-buttons button.active::after {
  background-color: var(--accent-color);
}

/* Enhanced Search Pill */
.search-container {
  display: flex;
  justify-content: center;
}

.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 700px;
}

.search-pill {
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-pill:focus-within {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-transparent);
}

.search-icon {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input.wrong-layout {
  color: var(--warning-color);
}

.reset-button {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
}

.reset-button:hover {
  color: var(--text-color);
}

/* Movie Row Styles */
.movie-row {
  margin-bottom: 40px;
}

.row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4%;
  margin-bottom: 16px;
}

.row-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.row-see-all {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;
}

.row-see-all:hover {
  color: var(--accent-color);
}

/* Section Styles */
.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding: 0 4%;
}

.search-results-section {
  padding-top: 20px;
}

/* Empty & Loading States */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}

.empty-history-notice {
  display: flex;
  justify-content: center;
  padding: 20px 4%;
}

.empty-history-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(30, 30, 30, 0.4);
  border-radius: 16px;
  color: var(--text-muted);
  gap: 10px;
  max-width: 300px;
}

.empty-history-content .material-icons {
  font-size: 48px;
  opacity: 0.5;
}

.empty-history-content p {
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

.empty-history-hint {
  font-size: 0.85rem;
  text-align: center;
  opacity: 0.7;
}

/* No Results */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-muted);
  gap: 15px;
}

.no-results .material-icons {
  font-size: 64px;
  opacity: 0.5;
}

.no-results p {
  font-size: 1.1rem;
  margin: 0;
}

/* Search Prompt */
.search-prompt {
  text-align: center;
  color: var(--text-muted);
  font-size: 1rem;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Layout Warning */
.layout-warning {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  text-align: center;
  color: var(--warning-color);
  font-size: 13px;
  background: rgba(230, 185, 30, 0.1);
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(230, 185, 30, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.3s ease;
  z-index: 1;
}

.layout-warning.show {
  opacity: 1;
  transform: translateY(0);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
    min-height: 400px;
  }
  
  .hero-content {
    left: 4%;
    right: 4%;
    max-width: none;
    bottom: 12%;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-description {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }
  
  .hero-btn {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
  
  .row-title {
    font-size: 1.2rem;
  }
  
  .floating-search-btn {
    top: 15px;
    right: 15px;
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 600px) {
  .hero-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .hero-btn {
    justify-content: center;
  }
  
  .search-pill {
    padding: 12px 18px;
  }
}
</style>
