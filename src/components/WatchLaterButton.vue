<template>
  <button
    :class="['watch-later-btn', { 'in-list': isInList }]"
    @click.stop="toggle"
    :title="isInList ? 'Remove from Watch Later' : 'Add to Watch Later'"
  >
    ✓
    +
    Watch Later
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

const isInList = computed(() => listsStore.isInWatchLater(props.movieId))

const toggle = () => {
  const added = listsStore.toggleWatchLater(props.movieId)
  showToast(added ? 'Added to Watch Later' : 'Removed from Watch Later')
}
</script>

<style scoped>
.watch-later-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.watch-later-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.watch-later-btn.in-list {
  background: #e50914;
  border-color: #e50914;
}

.watch-later-btn.in-list:hover {
  background: #f40612;
}

.btn-text {
  white-space: nowrap;
}
</style>
