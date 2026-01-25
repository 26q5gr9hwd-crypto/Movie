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
          <h1 class="hero-title">
            {{ featuredMovie.title }}
          </h1>

          <div class="hero-meta">
            <span
              v-if="featuredMovie.rating_kp"
              class="hero-rating"
            >
              <i class="fas fa-star"></i>
              {{ featuredMovie.rating_kp }}
            </span>

            <span
              v-if="featuredMovie.year"
              class="hero-year"
            >
              {{ featuredMovie.year }}
            </span>

            <span
              v-if="featuredMovie.type"
              class="hero-type"
            >
              {{ featuredMovie.type }}
            </span>
          </div>

          <p
            v-if="featuredMovie.description"
            class="hero-description"
          >
            {{ truncateText(featuredMovie.description, 200) }}
          </p>

          <div class="hero-actions">
            <button
              class="btn-primary"
              @click="goToMovie(featuredMovie.kp_id)"
            >
              <i class="fas fa-play"></i>
              Смотреть
            </button>

            <button
              class="btn-secondary"
              @click="openRandomMovie"
            >
              <i class="fas fa-dice"></i>
              Случайный фильм
            </button>
          </div>
        </div>
      </section>

      <!-- Fallback hero -->
      <section v-else class="hero-section hero-minimal">
        <div class="hero-gradient"></div>

        <div class="hero-content">
          <h1 class="hero-title">Откройте мир кино</h1>

          <p class="hero-description">
            Тысячи фильмов и сериалов в одном месте
          </p>

          <div class="hero-actions">
            <button
              class="btn-primary"
              @click="focusSearch"
            >
              <i class="fas fa-search"></i>
              Найти фильм
            </button>

            <button
              class="btn-secondary"
              @click="openRandomMovie"
            >
              <i class="fas fa-dice"></i>
              Мне повезёт
            </button>
          </div>
        </div>
      </section>

      <!-- Search -->
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

            <button
              v-if="searchTerm"
              class="clear-button"
              @click="resetSearch"
            >
              <i class="fas fa-times"></i>
            </button>

            <div
              v-if="showLayoutWarning"
              class="layout-warning show"
            >
              <i class="fas fa-keyboard"></i>
              Возможно, неправильная раскладка.
              Tab — переключить на {{ suggestedLayout }}
            </div>
          </div>

          <button
            class="advanced-toggle"
            :class="{ active: showAdvanced }"
            @click="showAdvanced = !showAdvanced"
          >
            <i class="fas fa-sliders-h"></i>
          </button>
        </div>

        <transition name="slide">
          <div
            v-if="showAdvanced"
            class="advanced-search"
          >
            <button
              v-for="type in searchTypes"
              :key="type.value"
              :class="[
                'search-type-btn',
                { active: searchType === type.value }
              ]"
              @click="setSearchType(type.value)"
            >
              {{ type.label }}
            </button>
          </div>
        </transition>
      </div>

      <!-- Results -->
      <div class="content-container">
        <section
          v-if="searchPerformed"
          class="content-section"
        >
          <h2 class="section-title">Результаты поиска</h2>

          <MovieList
            :movies-list="movies"
            :is-history="false"
            :loading="loading"
          />

          <div
            v-if="movies.length === 0 && !loading && !errorMessage"
            class="empty-state"
          >
            <i class="fas fa-film"></i>
            <p>Ничего не найдено</p>
          </div>

          <ErrorMessage
            v-if="errorMessage"
            :message="errorMessage"
            :code="errorCode"
          />
        </section>
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
// eslint-disable-next-line no-console
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
import {
  hasConsecutiveConsonants,
  suggestLayout,
  convertLayout
} from '@/utils/keyboardLayout'
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
const showAdvanced = ref(false)
const errorMessage = ref('')
const errorCode = ref(null)

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
  return text.slice(0, maxLength).trim() + '...'
}

const goToMovie = (kpId) => {
  router.push({ name: 'movie-info', params: { kp_id: kpId } })
}

const focusSearch = () => {
  searchInput.value?.focus()
}

const handleInput = (event) => {
  if (searchType.value !== 'title') return
  showLayoutWarning.value = hasConsecutiveConsonants(event.target.value)
  if (showLayoutWarning.value) {
    suggestedLayout.value = suggestLayout(event.target.value)
  }
}

const handleTabKey = () => {
  if (!showLayoutWarning.value) return
  searchTerm.value = convertLayout(searchTerm.value)
  showLayoutWarning.value = false
}

const resetSearch = () => {
  searchTerm.value = ''
  movies.value = []
  searchPerformed.value = false
}

const search = () => {
  if (!searchTerm.value) return
  performSearch()
}

const performSearch = async () => {
  loading.value = true
  searchPerformed.value = true
  movies.value = []

  try {
    const response = await apiSearch(searchTerm.value)
    movies.value = response
  } catch (error) {
    const { message, code } = handleApiError(error)
    errorMessage.value = message
    errorCode.value = code
    // eslint-disable-next-line no-console
    console.error(error)
  } finally {
    loading.value = false
  }
}

const debouncedPerformSearch = debounce(performSearch, 700)

watch(searchTerm, () => {
  if (searchType.value === 'title') {
    debouncedPerformSearch()
  }
})

const focusFirstMovieCard = () => {}

const openRandomMovie = () => {
  showRandomModal.value = true
  fetchRandomMovie()
}

const closeRandomModal = () => {
  showRandomModal.value = false
}

const fetchRandomMovie = async () => {
  randomLoading.value = true
  try {
    randomMovie.value = await getRandomMovie()
  } catch (error) {
    randomError.value = handleApiError(error).message
  } finally {
    randomLoading.value = false
  }
}
</script>
