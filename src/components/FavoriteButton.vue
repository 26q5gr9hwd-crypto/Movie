<template>
  <button
    :class="['favorite-btn', { 'is-favorite': isFavorite }]"
    @click.stop="toggle"
    :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
  >
    ♥
    ♡
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useListsStore } from '@/store/lists'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  movieId: {
    type: String,
    required: true
  }
})

const listsStore = useListsStore()
const { showToast } = useToast()

const isFavorite = computed(() => listsStore.isInFavorites(props.movieId))

const toggle = () => {
  const added = listsStore.toggleFavorites(props.movieId)
  showToast(added ? '♥ Added to Favorites' : 'Removed from Favorites')
}
</script>

<style scoped>
.favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.favorite-btn.is-favorite {
  color: #e50914;
}

.favorite-btn.is-favorite:hover {
  color: #f40612;
}
</style>
