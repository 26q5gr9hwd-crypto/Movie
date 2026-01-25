<template>
  <RouterLink
    ref="element"
    class="movie-card"
    :class="{
      active: activeMovieIndex === index,
      'has-border': isCardBorder,
      'hover-disabled': isCardHoverDisabled,
      'card-border': isCardBorder,
      [`card-size-${cardSize}`]: true,
      'carousel-mode': isCarousel
    }"
    :to="{ name: 'movie-info', params: { kp_id: movie.kp_id } }"
    :data-test-id="`movie-card-${movie.kp_id}`"
    tabindex="0"
  >
    <CardsMovieMainContent
      :movie
      :is-history
      :is-mobile
      :is-user-list="isUserList"
      :show-delete="showDelete"
      :show-star="showStar"
      @remove:from-history="(data) => emit('remove:from-history', data)"
    />

    <CardMovieDetails v-if="!isCarousel" :movie :is-history />

    <!-- Compact overlay for carousel mode -->
    <div v-if="isCarousel" class="card-overlay">
      <div class="card-overlay-content">
        <h4 class="card-overlay-title">
          {{ movie.title || movie.name }}
        </h4>
        <div class="card-overlay-meta">
          <span v-if="movie.year" class="card-overlay-year">
            {{ movie.year }}
          </span>
          <span
            v-if="movie.rating_kp"
            class="card-overlay-rating"
            :class="getRatingColorClass(movie.rating_kp)"
          >
            ★ {{ movie.rating_kp.toFixed(1) }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { onMounted, useTemplateRef, computed } from 'vue'
import CardMovieDetails from './CardMovieDetails.vue'
import CardsMovieMainContent from './CardsMovieMainContent.vue'
import { useBackgroundStore } from '@/store/background'
import { useMainStore } from '@/store/main'

const backgroundStore = useBackgroundStore()
const mainStore = useMainStore()
const isCardHoverDisabled = computed(
  () => backgroundStore.isCardHoverDisabled
)
const cardSize = computed(() => mainStore.cardSize)

const {
  movie,
  isHistory = false,
  isCardBorder = false,
  isMobile = false,
  isUserList = false,
  isCarousel = false,
  activeMovieIndex = null,
  index = 0,
  showDelete = true,
  showStar = false
} = defineProps({
  movie: Object,
  isHistory: Boolean,
  isMobile: Boolean,
  isCardBorder: Boolean,
  isUserList: Boolean,
  isCarousel: Boolean,
  index: Number,
  activeMovieIndex: [Number, null],
  showDelete: Boolean,
  showStar: Boolean
})

const emit = defineEmits(['remove:from-history', 'save:element'])
const element = useTemplateRef('element')

const getRatingColorClass = (rating) => {
  if (rating >= 7) return 'high'
  if (rating >= 5) return 'medium'
  return 'low'
}

onMounted(() => {
  if (element.value && element.value.$el) {
    emit('save:element', element.value.$el)
  }
})
</script>

<style scoped>
.movie-card {
  text-decoration: none;
  color: inherit;
  width: 100%;
  background: rgba(30, 30, 30, 0.6);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition:
    transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.3s ease,
    border 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  border: none;
  position: relative;
}

.has-border {
  border: 1px solid var(--accent-color);
}

.movie-card:hover {
  transform: scale(1.05) translateY(-8px);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.5),
    0 0 30px var(--accent-transparent);
  z-index: 10;
}

.hover-disabled:hover {
  transform: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.movie-card:focus {
  outline: 2px solid white;
  outline-offset: 2px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
  transition: border 0.2s ease;
  cursor: pointer;
}

.movie-card:hover :deep(.delete-button) {
  opacity: 1;
}

/* Carousel mode - poster focused */
.movie-card.carousel-mode {
  background: transparent;
  border-radius: 6px;
}

.movie-card.carousel-mode:hover {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 60%,
    transparent 100%
  );
  padding: 40px 12px 12px 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card.carousel-mode:hover .card-overlay {
  opacity: 1;
}

.card-overlay-content {
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.movie-card.carousel-mode:hover .card-overlay-content {
  transform: translateY(0);
}

.card-overlay-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.card-overlay-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
}

.card-overlay-year {
  color: var(--text-secondary);
}

.card-overlay-rating {
  font-weight: 600;
}

.card-overlay-rating.high {
  color: #46d369;
}

.card-overlay-rating.medium {
  color: #f5c518;
}

.card-overlay-rating.low {
  color: #ff6b6b;
}

.movie-card.card-size-small :deep(.movie-details) {
  padding: 10px;
}

.movie-card.card-size-small :deep(.movie-header h3) {
  font-size: 0.95em;
  -webkit-line-clamp: 3;
  -moz-line-clamp: 3;
  line-clamp: 3;
  max-height: 3.6em;
}

.movie-card.card-size-small :deep(.original-title) {
  font-size: 0.75em;
  -webkit-line-clamp: 1;
  -moz-line-clamp: 1;
  line-clamp: 1;
}

.movie-card.card-size-small :deep(.genre-tag),
.movie-card.card-size-small :deep(.genre-count) {
  font-size: 0.7em;
  padding: 1px 4px;
}

.movie-card.card-size-large :deep(.movie-details) {
  padding: 20px;
}

.movie-card.card-size-large :deep(.movie-header h3) {
  font-size: 1.3em;
  -webkit-line-clamp: 4;
  -moz-line-clamp: 4;
  line-clamp: 4;
  max-height: 5.2em;
}

.movie-card.card-size-large :deep(.original-title) {
  font-size: 0.9em;
  margin-bottom: 15px;
}

.movie-card.card-size-large :deep(.genre-tag),
.movie-card.card-size-large :deep(.genre-count) {
  font-size: 0.8em;
  padding: 3px 8px;
}

.movie-card.card-size-large :deep(.year) {
  font-size: 1em;
}

/* Мобильная версия */
@media (max-width: 620px) {
  .movie-card:not(.carousel-mode) {
    flex-direction: row;
    align-items: flex-start;
    height: 200px;
    width: 100%;
    border-radius: 15px;
  }

  .movie-card.carousel-mode {
    border-radius: 6px;
  }

  .movie-card.carousel-mode .card-overlay {
    opacity: 1;
    padding: 30px 8px 8px 8px;
  }

  .card-overlay-title {
    font-size: 0.75rem;
    -webkit-line-clamp: 1;
  }

  .card-overlay-meta {
    font-size: 0.7rem;
  }
}
</style>
