<template>
  <div class="user-lists">
    <h2>My Lists</h2>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'watchLater' }"
        @click="activeTab = 'watchLater'"
      >
        Watch Later ( watchLaterCount )
      </button>
      <button
        :class="{ active: activeTab === 'favorites' }"
        @click="activeTab = 'favorites'"
      >
        Favorites ( favoritesCount )
      </button>
    </div>

    <div class="list-content">
      <div v-if="loading" class="loading">
        <p>Loading...</p>
      </div>

      <div v-else-if="currentIds.length === 0" class="empty-state">
        <p v-if="activeTab === 'watchLater'">
          Your Watch Later list is empty. Browse movies to add some!
        </p>
        <p v-else>
          Your Favorites list is empty. Browse movies to add some!
        </p>
      </div>

      <div v-else class="movie-grid">
        <div
          v-for="movieId in currentIds"
          :key="movieId"
          class="movie-item"
        >
          <div class="movie-id">Movie ID:  movieId </div>
          <button
            class="remove-btn"
            @click="handleRemove(movieId)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useListsStore } from '@/store/lists'
import { useToast } from '@/composables/useToast'

const listsStore = useListsStore()
const { showToast } = useToast()

const activeTab = ref('watchLater')
const loading = ref(false)

const watchLaterCount = computed(() => listsStore.watchLaterCount)
const favoritesCount = computed(() => listsStore.favoritesCount)

const currentIds = computed(() =>
  activeTab.value === 'watchLater'
    ? listsStore.watchLaterIds
    : listsStore.favoritesIds
)

const handleRemove = (movieId) => {
  if (activeTab.value === 'watchLater') {
    listsStore.toggleWatchLater(movieId)
    showToast('Removed from Watch Later')
  } else {
    listsStore.toggleFavorites(movieId)
    showToast('Removed from Favorites')
  }
}
</script>

<style scoped>
.user-lists {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
}

.user-lists h2 {
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}

.tabs button {
  padding: 10px 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tabs button:hover {
  color: white;
}

.tabs button.active {
  color: white;
  border-bottom-color: #e50914;
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.movie-id {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  word-break: break-all;
}

.remove-btn {
  padding: 8px 12px;
  background: rgba(229, 9, 20, 0.8);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #e50914;
}
</style>
