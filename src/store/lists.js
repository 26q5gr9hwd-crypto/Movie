import { defineStore } from 'pinia'
import { loadLists, saveLists, clearLists } from '@/utils/listStorage'

// AUTH REMOVED - Lists functionality disabled until Phase 3 rebuild
// This store will be rebuilt with new simple auth system

export const useListsStore = defineStore('lists', {
  state: () => ({
    watchLater: [],
    favorites: [],
    initialized: false
  }),

  getters: {
    isInWatchLater: (state) => (movieId) => {
      return state.watchLater.some(item => item.movieId === movieId)
    },

    isInFavorites: (state) => (movieId) => {
      return state.favorites.some(item => item.movieId === movieId)
    },

    watchLaterCount: (state) => state.watchLater.length,

    favoritesCount: (state) => state.favorites.length,

    watchLaterIds: (state) => state.watchLater.map(item => item.movieId),

    favoritesIds: (state) => state.favorites.map(item => item.movieId)
  },

  actions: {
    // Stub methods - will be reimplemented with new auth in Phase 3
    initializeLists() {
      // Disabled - requires auth
      this.initialized = false
    },

    toggleWatchLater(movieId) {
      // Disabled - requires auth
      console.warn('Watch Later disabled - auth system being rebuilt')
      return false
    },

    toggleFavorites(movieId) {
      // Disabled - requires auth
      console.warn('Favorites disabled - auth system being rebuilt')
      return false
    },

    clearAllLists() {
      this.watchLater = []
      this.favorites = []
      this.initialized = false
    }
  }
})
