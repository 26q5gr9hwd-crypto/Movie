<template>
  <div class="featured-movie-container">
    <div class="featured-movie">
      <div class="poster-section">
        <img
          v-if="featuredMovie?.poster?.url"
          :src="featuredMovie.poster.url"
          :alt="featuredMovie.title"
          class="poster-image"
        />
      </div>

      <div class="content-section">
        <h1 class="movie-title">{{ featuredMovie.title }}</h1>

        <div class="movie-meta">
          <span class="rating">⭐ {{ featuredMovie.rating_kp }}</span>
          <span class="year">{{ featuredMovie.year }}</span>
          <span class="type">{{ featuredMovie.type }}</span>
        </div>

        <p class="description">
          {{ truncateText(featuredMovie.description, 200) }}
        </p>

        <button
          :class="['action-button', `layout-${suggestedLayout}`]"
          @click="selectMovie(featuredMovie)"
        >
          Select This Movie
        </button>
      </div>
    </div>

    <div class="layout-selector">
      <button
        v-for="type in layoutTypes"
        :key="type.value"
        :class="['layout-button', { active: suggestedLayout === type.value }]"
        @click="suggestedLayout = type.value"
      >
        {{ type.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['movie-selected'])

const suggestedLayout = ref('grid')

const layoutTypes = [
  { value: 'grid', label: 'Grid View' },
  { value: 'list', label: 'List View' },
  { value: 'carousel', label: 'Carousel View' },
]

const featuredMovie = computed(() => props.movie)

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const selectMovie = (movie) => {
  // eslint-disable-next-line no-console
  console.log('Selected movie:', movie)
  emit('movie-selected', movie)
}
</script>

<style scoped>
.featured-movie-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.featured-movie {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 30px;
  color: white;
}

.poster-section {
  flex-shrink: 0;
}

.poster-image {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.movie-title {
  font-size: 2.5rem;
  margin: 0 0 15px 0;
  font-weight: bold;
}

.movie-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.rating,
.year,
.type {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 20px;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.95;
}

.action-button {
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: white;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.layout-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.layout-button {
  padding: 10px 20px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.layout-button.active {
  background: #667eea;
  color: white;
}

.layout-button:hover {
  background: #667eea;
  color: white;
}
</style>
