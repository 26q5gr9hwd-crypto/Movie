<template>
  <div class="featured-movie-container">
    <div class="featured-movie">
      <img
        :src="featuredMovie.poster_url"
        :alt="featuredMovie.title"
        class="poster"
      />
      <div class="content">
        <h1 class="title">{{ featuredMovie.title }}</h1>
        <div class="meta">
          <span class="rating">{{ featuredMovie.rating_kp }}</span>
          <span class="year">{{ featuredMovie.year }}</span>
          <span class="type">{{ featuredMovie.type }}</span>
        </div>
        <p class="description">
          {{ truncateText(featuredMovie.description, 200) }}
        </p>
        <div class="controls">
          <button
            :class="['layout-btn', { active: suggestedLayout === 'grid' }]"
            @click="suggestedLayout = 'grid'"
          >
            Grid
          </button>
          <button
            :class="['layout-btn', { active: suggestedLayout === 'list' }]"
            @click="suggestedLayout = 'list'"
          >
            List
          </button>
        </div>
      </div>
    </div>

    <div class="suggested-movies" :class="suggestedLayout">
      <div
        v-for="type in movieTypes"
        :key="type.id"
        class="movie-type-section"
      >
        <h2>{{ type.label }}</h2>
        <div class="movies-grid">
          <div
            v-for="movie in type.movies"
            :key="movie.id"
            class="movie-card"
          >
            <img
              :src="movie.poster_url"
              :alt="movie.title"
              class="movie-poster"
            />
            <h3>{{ movie.title }}</h3>
            <p>{{ movie.year }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const featuredMovie = ref({
  id: 1,
  title: 'Example Movie',
  poster_url: 'https://via.placeholder.com/300x450',
  rating_kp: 8.5,
  year: 2023,
  type: 'Film',
  description:
    'This is a sample description that will be truncated ' +
    'if it exceeds 200 characters. ' +
    'Add more text here to test the truncation functionality.'
})

const suggestedLayout = ref('grid')

const movieTypes = ref([
  {
    id: 1,
    label: 'Popular Movies',
    movies: [
      {
        id: 1,
        title: 'Movie 1',
        year: 2023,
        poster_url: 'https://via.placeholder.com/200x300'
      },
      {
        id: 2,
        title: 'Movie 2',
        year: 2023,
        poster_url: 'https://via.placeholder.com/200x300'
      }
    ]
  },
  {
    id: 2,
    label: 'Top Rated',
    movies: [
      {
        id: 3,
        title: 'Movie 3',
        year: 2023,
        poster_url: 'https://via.placeholder.com/200x300'
      },
      {
        id: 4,
        title: 'Movie 4',
        year: 2023,
        poster_url: 'https://via.placeholder.com/200x300'
      }
    ]
  }
])

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

console.log('Featured movie:', featuredMovie.value)
console.log('Suggested layout:', suggestedLayout.value)
</script>

<style scoped>
.featured-movie-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.featured-movie {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
}

.poster {
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 2.5rem;
  margin: 0 0 15px 0;
  font-weight: bold;
}

.meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 1rem;
}

.rating,
.year,
.type {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 20px;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  gap: 10px;
}

.layout-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.layout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.layout-btn.active {
  background: white;
  color: #667eea;
}

.suggested-movies {
  margin-top: 40px;
}

.suggested-movies.grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.suggested-movies.list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.movie-type-section h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #333;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.suggested-movies.list .movies-grid {
  grid-template-columns: 1fr;
}

.movie-card {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-card h3 {
  padding: 10px;
  font-size: 1rem;
  margin: 0;
}

.movie-card p {
  padding: 0 10px 10px 10px;
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .featured-movie {
    flex-direction: column;
  }

  .poster {
    width: 100%;
    height: auto;
  }

  .title {
    font-size: 1.8rem;
  }

  .movies-grid {
    grid-template-columns: repeat(
      auto-fill,
      minmax(150px, 1fr)
    );
  }
}
</style>
