<template>
  <div class="search-modal-overlay" @click.self="closeModal">
    <div class="search-modal">
      <!-- Search Header -->
      <div class="search-modal-header">
        <div class="search-pill-modal">
          <i class="fas fa-search search-icon"></i>
          <input
            ref="searchInput"
            v-model="searchTerm"
            placeholder="Поиск фильмов и сериалов..."
            class="search-input-modal"
            inputmode="text"
            @keydown.enter="search"
            @keydown.down.prevent="focusFirstMovieCard"
            @keydown.esc="closeModal"
          />
          <button
            v-if="searchTerm"
            class="reset-button"
            @click="clearSearch"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <button class="close-modal-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Search Hint (when no search) -->
      <div
        v-if="searchTerm?.length < 2 && !loading"
        class="search-modal-hint"
      >
        <span
          ><i class="fas fa-keyboard"></i> Enter для поиска •
          Esc для закрытия</span
        >
      </div>

      <!-- Search Results -->
      <div v-if="searchTerm?.length >= 2" class="search-results-container">
        <!-- Loading Skeletons -->
        <template v-if="loading">
          <div v-for="idx in 4" :key="idx" class="movie-skeleton">
            <div class="movie-skeleton__poster"></div>
            <div class="movie-skeleton__content">
              <div class="movie-skeleton__title"></div>
              <div class="movie-skeleton__meta">
                <div class="movie-skeleton__rating"></div>
              </div>
            </div>
          </div>
        </template>

        <!-- No Results -->
        <div
          v-else-if="
            movies.length === 0 && !loading && !errorMessage
          "
          class="no-results"
        >
          <span class="material-icons">search_off</span>
          <p>Ничего не найдено</p>
        </div>

        <!-- Results List -->
        <div v-else-if="movies.length > 0" class="results-list">
          <router-link
            v-for="(movie, index) in movies"
            :key="movie.kp_id"
            class="search-result-item"
            :class="{ focused: activeMovieIndex === index }"
            :to="{
              name: 'movie-info',
              params: { kp_id: movie.kp_id }
            }"
            @click="closeModal"
          >
            <img
              v-if="movie.poster"
              :src="movie.poster"
              :alt="getMovieName(movie)"
              class="result-poster"
              loading="lazy"
            />
            <div
              v-else
              class="result-poster result-poster--placeholder"
            >
              <i class="fas fa-image"></i>
            </div>
            <div class="result-info">
              <div class="result-title">
                {{ getMovieName(movie) }}
              </div>
              <div class="result-meta">
                <span
                  class="result-rating"
                  :class="
                    getRatingColor(movie.raw_data?.rating)
                  "
                >
                  ★ {{ movie.raw_data?.rating || '—' }}
                </span>
                <span class="result-type">
                  {{
                    TYPES_ENUM[movie.type] || movie.type
                  }}
                </span>
                <span class="result-year">
                  {{ movie.year }}
                </span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Error -->
        <ErrorMessage
          v-if="errorMessage"
          :message="errorMessage"
          :code="errorCode"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { apiSearch } from '@/api/movies'
import ErrorMessage from '@/components/ErrorMessage.vue'
// eslint-disable-next-line no-unused-vars
import { handleApiError, TYPES_ENUM } from '@/constants'
import { useNavbarStore } from '@/store/navbar'
import debounce from 'lodash/debounce'
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue'
import { getRatingColor } from '@/utils/ratingUtils'
import { getMovieName } from '@/utils/textUtils'

const navbarStore = useNavbarStore()

// Helper function to normalize movie data
const normalizeMovie = (movie) => ({
  ...movie,
  kp_id: (movie.kp_id ?? movie.id)?.toString(),
  title:
    movie.title ||
    movie.name ||
    movie.raw_data?.name_ru ||
    movie.raw_data?.name_en ||
    movie.raw_data?.name_original ||
    '',
  year: movie.year || movie.raw_data?.year || null,
  poster:
    movie.poster ||
    movie.cover ||
    movie.raw_data?.poster?.url ||
    movie.raw_data?.poster_url ||
    null,
  rating_kp: movie.rating_kp ||
    (movie.raw_data?.rating !== 'null'
      ? movie.raw_data?.rating
      : null),
  type: movie.type || movie.raw_data?.type || null
})

const searchTerm = ref('')
const movies = ref([])
const loading = ref(false)

const errorMessage = ref('')
const errorCode = ref(null)

const searchInput = ref(null)
const activeMovieIndex = ref(null)

onMounted(async () => {
  await nextTick()
  document.addEventListener('keydown', handleKeyDown)
  searchInput.value?.focus()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

const resetSearch = () => {
  searchTerm.value = ''
  movies.value = []
  errorMessage.value = ''
  errorCode.value = null
}

const clearSearch = () => {
  searchTerm.value = ''
  movies.value = []
  searchInput.value?.focus()
}

const search = () => {
  debouncedPerformSearch.cancel()
  if (searchTerm.value) {
    performSearch()
  }
}

const performSearch = async () => {
  loading.value = true
  movies.value = []
  errorMessage.value = ''
  errorCode.value = null

  try {
    const results = await apiSearch(searchTerm.value)
    movies.value = (results || []).map(normalizeMovie)
  } catch (error) {
    const { message, code } = handleApiError(error)
    errorMessage.value = message
    errorCode.value = code
    console.error('Search error:', error)
    movies.value = []
  } finally {
    loading.value = false
  }
}

const debouncedPerformSearch = debounce(() => {
  if (searchTerm.value.length >= 2) {
    performSearch()
  } else if (searchTerm.value.length < 2) {
    movies.value = []
  }
}, 500)

const closeModal = (event) => {
  if (event?.button !== undefined) {
    const isLeftClick = event.button === 0
    const isNotModified = !event.ctrlKey && !event.metaKey
    if (!isLeftClick || !isNotModified) return
  }
  navbarStore.closeSearchModal()
  resetSearch()
}

const focusFirstMovieCard = () => {
  if (movies.value.length > 0) {
    activeMovieIndex.value = 0
    const firstCard = document.querySelector(
      '.search-result-item'
    )
    firstCard?.focus()
  }
}

const handleKeyDown = (event) => {
  if (!movies.value?.length) return
  if (
    !event.target?.classList?.contains('search-result-item')
  )
    return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeMovieIndex.value = Math.min(
        activeMovieIndex.value + 1,
        movies.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      if (activeMovieIndex.value <= 0) {
        searchInput.value?.focus()
        activeMovieIndex.value = null
      } else {
        activeMovieIndex.value = Math.max(
          activeMovieIndex.value - 1,
          0
        )
      }
      break
  }
}

watch(activeMovieIndex, (newIndex) => {
  if (newIndex !== null) {
    const cards = document.querySelectorAll(
      '.search-result-item'
    )
    cards[newIndex]?.focus()
  }
})

watch(searchTerm, () => {
  debouncedPerformSearch()
})
</script>

<style lang="scss" scoped>
.search-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}

.search-modal {
  width: 100%;
  max-width: 650px;
  padding: 0 20px;
  animation: modalSlideDown 0.3s ease-out;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

@keyframes modalSlideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-pill-modal {
  flex: 1;
  background: rgba(40, 40, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.search-pill-modal:focus-within {
  border-color: var(--accent-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 3px var(--accent-transparent);
}

.search-icon {
  color: var(--text-muted);
  font-size: 1.2rem;
}

.search-input-modal {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1.1rem;
  outline: none;

  &::placeholder {
    color: var(--text-muted);
  }
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

  &:hover {
    color: var(--text-color);
  }
}

.close-modal-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(60, 60, 60, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(80, 80, 80, 0.9);
    transform: scale(1.05);
  }
}

.search-modal-hint {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: 20px;
  opacity: 0.7;

  i {
    margin-right: 6px;
  }
}

.search-results-container {
  margin-top: 16px;
  overflow-y: auto;
  max-height: calc(80vh - 140px);
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s ease;
  outline: none;

  &:hover,
  &:focus,
  &.focused {
    background: rgba(255, 255, 255, 0.08);
  }

  &:focus {
    box-shadow: 0 0 0 2px var(--accent-color);
  }
}

.result-poster {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  &--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 1.4rem;
  }
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.result-rating {
  font-weight: 600;

  &.low {
    color: #ff6b6b;
  }

  &.medium {
    color: #ffd93d;
  }

  &.high {
    color: #51cf66;
  }
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--text-muted);
  gap: 12px;

  .material-icons {
    font-size: 48px;
    opacity: 0.5;
  }

  p {
    font-size: 1rem;
    margin: 0;
  }
}

.movie-skeleton {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;

  &__poster {
    width: 40px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    animation: shimmer 1.5s infinite linear;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    width: 60%;
    height: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    animation: shimmer 1.5s infinite linear;
  }

  &__meta {
    display: flex;
    gap: 8px;
  }

  &__rating {
    width: 50px;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    animation: shimmer 1.5s infinite linear;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.movie-skeleton__poster,
.movie-skeleton__title,
.movie-skeleton__rating {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
}

@media (max-width: 768px) {
  .search-modal-overlay {
    padding-top: 8vh;
  }

  .search-pill-modal {
    padding: 14px 18px;
  }

  .search-input-modal {
    font-size: 1rem;
  }

  .close-modal-btn {
    width: 44px;
    height: 44px;
  }
}
</style>
