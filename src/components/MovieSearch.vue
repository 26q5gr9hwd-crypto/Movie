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
          <h1 class="hero-title">{{ featuredMovie.title }}</h1>

          <div class="hero-meta">
            <span v-if="featuredMovie.rating_kp" class="hero-rating">
              <i class="fas fa-star"></i>
              {{ featuredMovie.rating_kp }}
            </span>
            <span v-if="featuredMovie.year" class="hero-year">
              {{ featuredMovie.year }}
            </span>
            <span v-if="featuredMovie.type" class="hero-type">
              {{ featuredMovie.type }}
            </span>
          </div>

          <p v-if="featuredMovie.description" class="hero-description">
            {{ truncateText(featuredMovie.description, 200) }}
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

      <!-- Search -->
      <div class="search-section">
        <div class="search-container">
          <div class="input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              ref="searchInput"
              v-model="searchTerm"
              class="search-input"
              :class="{ 'wrong-layout': showLayoutWarning }"
              placeholder="Поиск фильмов и сериалов..."
              @keydown.enter.prevent="search"
              @keydown.tab.prevent="handleTabKey"
              @input="handleInput"
            />

            <div
              v-if="showLayoutWarning"
              class="layout-warning show"
            >
              Tab — переключить на {{ suggestedLayout }}
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="content-container">
        <MovieList
          :movies-list="movies"
          :loading="loading"
        />

        <ErrorMessage
          v-if="errorMessage"
          :message="errorMessage"
        />
      </div>
    </div>

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

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

/* Components */
import MovieList from "@/components/MovieList.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import RandomMovieModal from "@/components/RandomMovieModal.vue";

/* Router */
const router = useRouter();

/* Search */
const searchInput = ref<HTMLInputElement | null>(null);
const searchTerm = ref("");
const loading = ref(false);
const errorMessage = ref("");
const movies = ref<any[]>([]);
const searchPerformed = ref(false);

/* Hero */
const featuredMovie = computed(() => movies.value[0] || null);

/* Layout detection */
const showLayoutWarning = ref(false);
const suggestedLayout = ref("EN");

/* Random movie modal */
const showRandomModal = ref(false);
const randomMovie = ref<any | null>(null);
const randomLoading = ref(false);
const randomError = ref("");

/* Helpers */
function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;
}

/* Search logic */
async function search() {
  if (!searchTerm.value.trim()) return;

  loading.value = true;
  errorMessage.value = "";
  searchPerformed.value = true;

  try {
    // ⛔ Replace with real API
    movies.value = [
      {
        kp_id: 1,
        title: "Example Movie",
        description: "Movie description goes here",
        poster: "https://via.placeholder.com/800x450",
        rating_kp: 8.5,
        year: 2024,
        type: "Movie",
      },
    ];
  } catch (err) {
    errorMessage.value = "Ошибка поиска";
  } finally {
    loading.value = false;
  }
}

function handleInput() {
  showLayoutWarning.value =
    /[а-яА-Я]/.test(searchTerm.value);
}

function handleTabKey() {
  suggestedLayout.value =
    suggestedLayout.value === "EN" ? "RU" : "EN";
  showLayoutWarning.value = false;
}

/* Navigation */
function goToMovie(id: number) {
  router.push({ name: "movie", params: { id } });
}

/* Random movie */
function openRandomMovie() {
  showRandomModal.value = true;
  fetchRandomMovie();
}

async function fetchRandomMovie() {
  randomLoading.value = true;
  randomError.value = "";

  try {
    randomMovie.value = {
      title: "Random Movie",
      poster: "https://via.placeholder.com/300x450",
    };
  } catch (err) {
    randomError.value = "Ошибка загрузки случайного фильма";
  } finally {
    randomLoading.value = false;
  }
}

function closeRandomModal() {
  showRandomModal.value = false;
}

/* Autofocus */
onMounted(() => {
  searchInput.value?.focus();
});
</script>
