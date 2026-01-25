<template>
  <div>
    <!-- Carousel/Horizontal Layout -->
    <div v-if="isCarousel" class="carousel-container">
      <button 
        v-if="!isMobile" 
        class="carousel-arrow carousel-arrow-left" 
        @click="scrollCarousel('left')"
        :class="{ hidden: !canScrollLeft }"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <div ref="carouselWrapper" class="carousel-wrapper" @scroll="updateScrollState">
        <div class="carousel-track">
          <div 
            v-for="(movie, index) in displayedMovies" 
            :key="movie.kp_id" 
            class="carousel-card"
          >
            <CardMovie
              :movie
              :is-history="false"
              :is-mobile
              :is-carousel="true"
              :index
              :show-delete="false"
              :show-star="false"
            />
          </div>
        </div>
      </div>
      
      <button 
        v-if="!isMobile" 
        class="carousel-arrow carousel-arrow-right" 
        @click="scrollCarousel('right')"
        :class="{ hidden: !canScrollRight }"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Grid Layout (default) -->
    <div v-else>
      <div v-show="!loading" class="grid" :class="`card-size-${cardSize}`">
        <template v-if="(isHistory || isUserList) && isMobile">
          <CardMovieSwipeWrapper
            v-for="(movie, index) in moviesList"
            :key="movie.kp_id"
            :data-test-id="`movie-card-swipe-wrapper-${movie.kp_id}`"
            :show-delete="showDelete"
            @slide="removeFromHistory(movie.kp_id)"
          >
            <CardMovie
              :movie
              :is-history
              :is-mobile
              :is-user-list="isUserList"
              :index
              :is-card-border="isCardBorder"
              :active-movie-index
              :show-delete="showDelete"
              :show-star="showStar"
              @remove:from-history="removeFromHistory"
              @save:element="(el) => (movieRefs[index] = el)"
            />
          </CardMovieSwipeWrapper>
        </template>

        <template v-else>
          <CardMovie
            v-for="(movie, index) in moviesList"
            :key="movie.kp_id"
            :movie
            :is-history="isHistory"
            :is-mobile="isMobile"
            :is-user-list="isUserList"
            :index
            :is-card-border="isCardBorder"
            :active-movie-index
            :show-delete="showDelete"
            :show-star="showStar"
            @remove:from-history="removeFromHistory"
            @save:element="(el) => (movieRefs[index] = el)"
          />
        </template>
      </div>
      <Spinner v-if="loading" />
    </div>
  </div>
</template>

<script setup>
import Spinner from '@/components/SpinnerLoading.vue'
import { useBackgroundStore } from '@/store/background'
import { useMainStore } from '@/store/main'
import { useAuthStore } from '@/store/auth'
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CardMovie, CardMovieSwipeWrapper } from '../CardMovie'
import { delFromList } from '@/api/user'
import { handleApiError } from '@/constants'
import { USER_LIST_TYPES_ENUM } from '@/constants'

const mainStore = useMainStore()
const authStore = useAuthStore()
const backgroundStore = useBackgroundStore()
const router = useRouter()
const route = useRoute()

const {
  moviesList,
  isHistory = false,
  loading = true,
  showDelete = true,
  showStar = false,
  isCarousel = false,
  carouselLimit = 15
} = defineProps({
  moviesList: Array,
  isHistory: Boolean,
  loading: Boolean,
  showDelete: Boolean,
  showStar: Boolean,
  isCarousel: Boolean,
  carouselLimit: Number
})

const movieRefs = ref([])
const activeMovieIndex = ref(null)
const carouselWrapper = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

const isCardBorder = computed(() => backgroundStore.isCardBorder)
const isMobile = computed(() => mainStore.isMobile)
const cardSize = computed(() => mainStore.cardSize)
const isUserList = computed(() => {
  return (
    route.name === 'lists' &&
    (!route.params.user_id || String(route.params.user_id) === String(authStore.user?.id))
  )
})

// Limit movies for carousel mode
const displayedMovies = computed(() => {
  if (isCarousel && carouselLimit) {
    return moviesList?.slice(0, carouselLimit) || []
  }
  return moviesList || []
})

const movieUrl = (movie) => {
  return router.resolve({ name: 'movie-info', params: { kp_id: movie.kp_id } }).href
}

const emit = defineEmits(['item-deleted'])
const removeFromHistory = async (kp_id) => {
  if (authStore.token) {
    try {
      await delFromList(kp_id, USER_LIST_TYPES_ENUM.HISTORY)
      emit('item-deleted', kp_id)
    } catch (error) {
      const { code } = handleApiError(error)
      console.error('Ошибка загрузки истории:', error)
      if (code === 401) {
        authStore.logout()
        await router.push('/login')
        router.go(0)
      }
    }
  } else {
    mainStore.removeFromHistory(kp_id)
  }
}

// Carousel scroll functions
const scrollCarousel = (direction) => {
  if (!carouselWrapper.value) return
  const scrollAmount = carouselWrapper.value.clientWidth * 0.8
  const newScrollLeft = direction === 'left' 
    ? carouselWrapper.value.scrollLeft - scrollAmount
    : carouselWrapper.value.scrollLeft + scrollAmount
  
  carouselWrapper.value.scrollTo({
    left: newScrollLeft,
    behavior: 'smooth'
  })
}

const updateScrollState = () => {
  if (!carouselWrapper.value) return
  const { scrollLeft, scrollWidth, clientWidth } = carouselWrapper.value
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

const handleKeyDown = (event) => {
  if (!moviesList?.length) return

  if (!event.target?.classList?.contains('movie-card')) {
    return
  }

  const grid = document.querySelector('.grid')
  const gridStyle = window.getComputedStyle(grid)
  const columns = gridStyle.gridTemplateColumns.split(' ').length

  switch (event.key) {
    case 'ArrowRight':
      activeMovieIndex.value = (activeMovieIndex.value + 1) % moviesList.length
      break
    case 'ArrowLeft':
      activeMovieIndex.value = (activeMovieIndex.value - 1 + moviesList.length) % moviesList.length
      break
    case 'ArrowUp':
      event.preventDefault()
      if (activeMovieIndex.value <= 0) {
        const searchInput = document.querySelector('.search-input')
        if (searchInput) {
          searchInput.focus()
        }
      } else {
        activeMovieIndex.value = Math.max(activeMovieIndex.value - columns, 0)
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      activeMovieIndex.value = Math.min(activeMovieIndex.value + columns, moviesList.length - 1)
      break
    case 'Home':
      activeMovieIndex.value = 0
      break
    case 'End':
      activeMovieIndex.value = moviesList.length - 1
      break
    case 'Enter':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        window.open(movieUrl(moviesList[activeMovieIndex.value]), '_blank')
      } else {
        router.push({
          name: 'movie-info',
          params: { kp_id: moviesList[activeMovieIndex.value]?.kp_id }
        })
      }
      break
  }
}

watch(activeMovieIndex, (newIndex) => {
  if (movieRefs.value[newIndex]) {
    movieRefs.value[newIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })
    movieRefs.value[newIndex].focus()
  }
})

watch(() => moviesList, () => {
  nextTick(() => {
    updateScrollState()
  })
}, { deep: true })

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  nextTick(() => {
    updateScrollState()
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.grid {
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  position: relative;
  min-height: 300px;
}

.grid.card-size-small {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.grid.card-size-medium {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 15px;
}

.grid.card-size-large {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* Carousel Styles */
.carousel-container {
  position: relative;
  padding: 0;
}

.carousel-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 10px 4% 30px 4%;
  margin: -10px 0 -30px 0;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none;
}

.carousel-track {
  display: flex;
  gap: 10px;
}

.carousel-card {
  flex: 0 0 auto;
  width: 180px;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-card:hover {
  z-index: 10;
}

.carousel-card:first-child {
  margin-left: 0;
}

.carousel-arrow {
  position: absolute;
  top: 0;
  bottom: 30px;
  width: 4%;
  min-width: 40px;
  background: linear-gradient(to right, rgba(20, 20, 20, 0.9), transparent);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-container:hover .carousel-arrow:not(.hidden) {
  opacity: 1;
}

.carousel-arrow:hover {
  background: linear-gradient(to right, rgba(20, 20, 20, 0.95), rgba(20, 20, 20, 0.3));
}

.carousel-arrow-left {
  left: 0;
}

.carousel-arrow-right {
  right: 0;
  background: linear-gradient(to left, rgba(20, 20, 20, 0.9), transparent);
}

.carousel-arrow-right:hover {
  background: linear-gradient(to left, rgba(20, 20, 20, 0.95), rgba(20, 20, 20, 0.3));
}

.carousel-arrow.hidden {
  opacity: 0 !important;
  pointer-events: none;
}

@media (max-width: 768px) {
  .carousel-card {
    width: 130px;
  }
  
  .carousel-wrapper {
    padding: 5px 4% 20px 4%;
    margin: -5px 0 -20px 0;
  }
  
  .carousel-track {
    gap: 8px;
  }
}

@media (max-width: 620px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 5px;
  }
  
  .carousel-card {
    width: 120px;
  }
}
</style>
