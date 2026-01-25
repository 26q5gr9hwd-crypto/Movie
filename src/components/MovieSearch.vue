<template>
  <div class="wrapper">
    <div class="mainpage">
      <!-- Hero Section -->
      <section v-if="featuredMovie" class="hero-section">
        <div
          class="hero-backdrop"
          :style="{ backgroundImage: `url(${featuredMovie.poster})` }"
        ></div>
        <div class="hero-gradient"></div>

        <div class="hero-content">
          <h1 class="hero-title"> featuredMovie.title </h1>

          <div class="hero-meta">
            <span v-if="featuredMovie.rating_kp" class="hero-rating">
              <i class="fas fa-star"></i>
               featuredMovie.rating_kp 
            </span>
            <span v-if="featuredMovie.year" class="hero-year">
               featuredMovie.year 
            </span>
            <span v-if="featuredMovie.type" class="hero-type">
               featuredMovie.type 
            </span>
          </div>

          <p v-if="featuredMovie.description" class="hero-description">
             truncateText(featuredMovie.description, 200) 
          </p>

          <div class="hero-actions">
            <button class="btn-primary" @click="goToMovie(featuredMovie.kp_id)">
              <i class="fas fa-play"></i> Смотреть
            </button>
            <button class="btn-secondary" @click="openRandomMovie">
              <i class="fas fa-dice"></i> Случайный фильм
            </button>
          </div>
        </div>
      </section>

      <!-- Fallback hero when no featured movie -->
      <section v-else class="hero-section hero-minimal">
        <div class="hero-gradient"></div>
        <div class="hero-content">
          <h1 class="hero-title">Откройте мир кино</h1>
          <p class="hero-description">Тысячи фильмов и сериалов в одном месте</p>
          <div class="hero-actions">
            <button class="btn-primary" @click="focusSearch">
              <i class="fas fa-search"></i> Найти фильм
            </button>
            <button class="btn-secondary" @click="openRandomMovie">
              <i class="fas fa-dice"></i> Мне повезёт
            </button>
          </div>
        </div>
      </section>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-container">
          <div class="input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              ref="searchInput"
              v-model="searchTerm"
              placeholder="Поиск фильмов и сериалов..."
              class="search-input"
              :class="{ 'wrong-layout': showLayoutWarning }"
              @keydown.enter.prevent="search"
              @keydown.tab.prevent="handleTabKey"
              @keydown.down.prevent="focusFirstMovieCard"
              @input="handleInput"
            />
            <button v-if="searchTerm" class="clear-button" @click="resetSearch">
              <i class="fas fa-times"></i>
            </button>
            <div
              v-if="showLayoutWarning"
              class="layout-warning"
              :class="{ show: showLayoutWarning }"
            >
              <i class="fas fa-keyboard"></i>
              Возможно, неправильная раскладка. Tab — переключить на  suggestedLayout 
            </div>
          </div>
          <!-- Advanced search toggle -->
          <button
            class="advanced-toggle"
            @click="showAdvanced = !showAdvanced"
            :class="{ active: showAdvanced }"
          >
            <i class="fas fa-sliders-h"></i>
          </button>
        </div>

        <!-- Advanced Search Options (collapsed by default) -->
        <transition name="slide">
          <div v-if="showAdvanced" class="advanced-search">
            <button
              v-for="type in searchTypes"
              :key="type.value"
              :class="['search-type-btn', { active: searchType === type.value }]"
              @click="setSearchType(type.value)"
            >
               type.label 
            </button>
          </div>
        </transition>
      </div>

      <!-- Content Container -->
      <div class="content-container">
        <!-- Search Results -->
        <section v-if="searchPerformed" class="content-section">
          <h2 class="section-title">Результаты поиска</h2>
          <MovieList :movies-list="movies" :is-history="false" :loading="loading" />
          <div v-if="movies.length === 0 && !loading && !errorMessage" class="empty-state">
            <i class="fas fa-film"></i>
            <p>Ничего не найдено</p>
          </div>
          <ErrorMessage v-if="errorMessage" :message="errorMessage" :code="errorCode" />
        </section>

        <!-- History Section (when not searching) -->
        <section v-if="!searchTerm" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-history"></i> Продолжить просмотр
            </h2>
            <button v-if="history.length > 0" class="clear-history-btn" @click="showModal = true">
              <i class="fas fa-trash-alt"></i> Очистить
            </button>
          </div>

          <div v-if="loading" class="loading-container">
            <SpinnerLoading />
          </div>

          <div v-else-if="history.length === 0" class="empty-state">
            <i class="fas fa-film"></i>
            <p>История пуста</p>
            <span class="empty-hint">Ваши просмотренные фильмы появятся здесь</span>
          </div>

          <MovieList
            v-else
            :movies-list="history"
            :is-history="true"
            :loading="false"
            @item-deleted="handleItemDeleted"
          />

          <BaseModal
            :is-open="showModal"
            message="Очистить историю просмотра?"
            @confirm="clearAllHistory"
            @close="showModal = false"
          />
        </section>

        <ErrorMessage v-if="!searchTerm && errorMessage" :message="errorMessage" :code="errorCode" />
      </div>
    </div>

    <FooterDonaters />

    <RandomMovieModal
      :is-open="showRandomModal"
      :movie="randomMovie"
      :loading="randomLoading"
      :error="randomError"
      @close="closeRandomModal"
      @get-new-movie="fetchRandomMovie"
    />
  </div>
</template>

<script setup>
import {
  apiSearch,
  getKpIDfromIMDB,
  getKpIDfromSHIKI,
  getRandomMovie,
  getKpInfo
} from '@/api/movies'
import { handleApiError } from '@/constants'
import { getMyLists, delAllFromList } from '@/api/user'
import BaseModal from '@/components/BaseModal.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FooterDonaters from '@/components/FooterDonaters.vue'
import { MovieList } from '@/components/MovieList/'
import { useMainStore } from '@/store/main'
import { useAuthStore } from '@/store/auth'
import { USER_LIST_TYPES_ENUM } from '@/constants'
import { hasConsecutiveConsonants, suggestLayout, convertLayout } from '@/utils/keyboardLayout'
import debounce from 'lodash/debounce'
import { watchEffect, onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import RandomMovieModal from '@/components/RandomMovieModal.vue'

const mainStore = useMainStore()
const authStore = useAuthStore()
const router = useRouter()

const searchType = ref('title')
const searchTerm = ref('')
const movies = ref([])
const loading = ref(false)
const searchPerformed = ref(false)
const showModal = ref(false)
const showAdvanced = ref(false)
const errorMessage = ref('')
const errorCode = ref(null)
const isMobile = computed(() => mainStore.isMobile)
const history = ref([])
const featuredMovie = ref(null)

const showLayoutWarning = ref(false)
const suggestedLayout = ref('')

const showRandomModal = ref(false)
const randomMovie = ref(null)
const randomLoading = ref(false)
const randomError = ref('')

const searchInput = ref(null)

const searchTypes = [
  { value: 'title', label: 'Название' },
  { value: 'kinopoisk', label: 'ID Кинопоиск' },
  { value: 'shikimori', label: 'ID Shikimori' },
  { value: 'imdb', label: 'ID IMDB' }
]

const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

const goToMovie = (kpId) => {
  router.push({ name: 'movie-info', params: { kp_id: kpId } })
}

const focusSearch = () => {
  searchInput.value?.focus()
}

// Load featured movie from history or random
const loadFeaturedMovie = async () => {
  if (history.value.length > 0) {
    const recent = history.value[0]
    try {
      const kpInfo = await getKpInfo(recent.kp_id)
      featuredMovie.value = {
        ...recent,
        description: kpInfo.description,
        poster: recent.poster || kpInfo.poster
      }
    } catch {
      featuredMovie.value = recent
    }
  }
}

watchEffect(async () => {
  if (authStore.token) {
    loading.value = true
    try {
      history.value = await getMyLists(USER_LIST_TYPES_ENUM.HISTORY)
      await loadFeaturedMovie()
    } catch (error) {
      const { message, code } = handleApiError(error)
      errorMessage.value = message
      errorCode.value = code
      console.error('Ошибка загрузки истории:', error)
      if (code === 401) {
        authStore.logout()
        await router.push('/login')
        router.go(0)
      }
    } finally {
      loading.value = false
    }
  } else {
    history.value = mainStore.history
    await loadFeaturedMovie()
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

  if (searchType.value === 'title') {
    searchTerm.value = event.target.value
    if (isMobile.value) return
    showLayoutWarning.value = hasConsecutiveConsonants(searchTerm.value)
    if (showLayoutWarning.value) {
      suggestedLayout.value = suggestLayout(searchTerm.value)
    }
  } else {
    searchTerm.value = event.target.value.replace(/\D+/g, '')
  }
}

const handleTabKey = () => {
  if (showLayoutWarning.value) {
    searchTerm.value = convertLayout(searchTerm.value)
    showLayoutWarning.value = false
  }
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
  loading.value = true
  searchPerformed.value = true
  movies.value = []

  try {
    if (searchType.value === 'kinopoisk') {
      if (!/^\d+$/.test(searchTerm.value)) {
        searchTerm.value = searchTerm.value.replace(/\D/g, '')
      }
      router.push({ name: 'movie-info', params: { kp_id: searchTerm.value } })
      return
    }

    if (searchType.value === 'imdb') {
      if (!/^\d+$/.test(searchTerm.value)) {
        searchTerm.value = searchTerm.value.replace(/\D/g, '')
      }
      const response = await getKpIDfromIMDB(searchTerm.value)
      if (response.id_kp) {
        router.push({ name: 'movie-info', params: { kp_id: `${response.id_kp}` } })
      } else {
        throw new Error('Не найдено')
      }
      return
    }

    if (searchType.value === 'shikimori') {
      if (!/^\d+$/.test(searchTerm.value)) {
        searchTerm.value = searchTerm.value.replace(/\D/g, '')
      }

      try {
        const response = await getKpIDfromSHIKI(searchTerm.value)
        if (response.id_kp) {
          router.push({ name: 'movie-info', params: { kp_id: `${response.id_kp}` } })
          return
        }
      } catch (e) {
        console.log('Switch to kodik', e)
      }

      router.push({ name: 'movie-info-shiki', params: { shiki_id: `shiki${searchTerm.value}` } })
      return
    }

    if (searchType.value === 'title') {
      const response = await apiSearch(searchTerm.value)
      movies.value = response.map((movie) => ({
        ...movie,
        kp_id: movie.id.toString(),
        rating_kp: movie.raw_data?.rating !== 'null' ? movie.raw_data?.rating : null,
        type: movie.raw_data?.type
      }))
    }
  } catch (error) {
    const { message, code } = handleApiError(error)
    errorMessage.value = message
    errorCode.value = code
    console.error('Ошибка при поиске:', error)
  } finally {
    loading.value = false
  }
}

const clearAllHistory = async () => {
  loading.value = true
  if (authStore.token) {
    try {
      await delAllFromList(USER_LIST_TYPES_ENUM.HISTORY)
      history.value = []
      featuredMovie.value = null
      loading.value = false
      showModal.value = false
    } catch (error) {
      const { message, code } = handleApiError(error)
      errorMessage.value = message
      errorCode.value = code
      console.error('Ошибка загрузки истории:', error)
      if (code === 401) {
        authStore.logout()
        await router.push('/login')
        router.go(0)
      }
      loading.value = false
      showModal.value = false
    }
  } else {
    mainStore.clearAllHistory()
    featuredMovie.value = null
    loading.value = false
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
  const hash = window.location.hash
  if (hash.startsWith('#search=')) {
    const searchQuery = decodeURIComponent(hash.replace('#search=', ''))
    searchTerm.value = searchQuery
    performSearch()
  } else if (hash.startsWith('#imdb=')) {
    const imdbId = decodeURIComponent(hash.replace('#imdb=', ''))
    setSearchType('imdb')
    searchTerm.value = imdbId
    performSearch()
  } else if (hash.startsWith('#shiki')) {
    const shikiId = decodeURIComponent(hash.replace('#shiki', ''))
    setSearchType('shikimori')
    searchTerm.value = shikiId
    performSearch()
  }
})

watch(searchTerm, () => {
  if (searchType.value !== 'title') {
    return
  }
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

const openRandomMovie = () => {
  showRandomModal.value = true
  fetchRandomMovie()
}

const closeRandomModal = () => {
  showRandomModal.value = false
  randomMovie.value = null
  randomError.value = ''
}

const fetchRandomMovie = async () => {
  randomLoading.value = true
  randomError.value = ''

  try {
    const response = await getRandomMovie()

    if (response.kp_id) {
      try {
        const kpInfo = await getKpInfo(response.kp_id)
        randomMovie.value = {
          ...response,
          description: kpInfo.description,
          budget: kpInfo.budget,
          fees_world: kpInfo.fees_world,
          fees_russia: kpInfo.fees_russia,
          premiere_ru: kpInfo.premiere_ru,
          premiere_world: kpInfo.premiere_world,
          age_rating: kpInfo.age_rating,
          duration: kpInfo.duration,
          total_rating: kpInfo.total_rating
        }
      } catch {
        randomMovie.value = response
      }
    } else {
      randomMovie.value = response
    }
  } catch (error) {
    const { message } = handleApiError(error)
    randomError.value = message
    console.error('Ошибка при получении случайного фильма:', error)
  } finally {
    randomLoading.value = false
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
}

/* ===== HERO SECTION ===== */
.hero-section {
  position: relative;
  height: 70vh;
  min-height: 400px;
  max-height: 600px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  margin-bottom: 20px;
}

.hero-minimal {
  height: 50vh;
  min-height: 300px;
  max-height: 400px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  filter: brightness(0.4);
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--bg-primary) 0%,
    rgba(20, 20, 20, 0.8) 30%,
    rgba(20, 20, 20, 0.4) 60%,
    transparent 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 40px;
  max-width: 700px;
}

.hero-minimal .hero-content {
  text-align: center;
  max-width: 600px;
}

.hero-title {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
  margin: 0 0 12px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  line-height: 1.1;
}

.hero-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.hero-minimal .hero-meta {
  justify-content: center;
}

.hero-rating {
  color: #ffd700;
  font-weight: 600;
}

.hero-rating i {
  margin-right: 4px;
}

.hero-description {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 24px;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-minimal .hero-actions {
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: scale(1.02);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ===== SEARCH SECTION ===== */
.search-section {
  padding: 0 20px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 16px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 48px 14px 48px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-transparent);
}

.search-input.wrong-layout {
  border-color: var(--error-color);
}

.clear-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.clear-button:hover {
  opacity: 1;
}

.advanced-toggle {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.advanced-toggle:hover,
.advanced-toggle.active {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.advanced-search {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.search-type-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--bg-tertiary);
  border: 1px solid transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-type-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

.search-type-btn.active {
  background: var(--accent-transparent);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.layout-warning {
  position: absolute;
  bottom: -44px;
  left: 0;
  right: 0;
  text-align: center;
  color: var(--error-color);
  font-size: 13px;
  background: rgba(232, 124, 3, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(232, 124, 3, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.layout-warning.show {
  opacity: 1;
  transform: translateY(0);
}

/* ===== CONTENT SECTIONS ===== */
.content-container {
  padding: 20px;
}

.content-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: var(--text-muted);
  font-size: 18px;
}

.clear-history-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.clear-history-btn:hover {
  background: var(--bg-tertiary);
  color: var(--accent-color);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--text-muted);
  gap: 12px;
}

.empty-state i {
  font-size: 48px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.empty-hint {
  font-size: 13px;
  opacity: 0.7;
}

/* ===== MOBILE ===== */
@media (max-width: 600px) {
  .hero-section {
    height: 50vh;
    min-height: 300px;
  }

  .hero-content {
    padding: 20px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .search-section {
    padding: 0 16px 16px;
  }

  .content-container {
    padding: 16px;
  }
}
</style>
