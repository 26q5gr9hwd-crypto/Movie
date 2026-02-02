import { defineStore } from 'pinia'
import { loadLists, saveLists, clearLists } from '@/utils/listStorage'
import { useAuthStore } from '@/store/auth/auth'

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
    initializeLists() {
      const authStore = useAuthStore()
      const userId = authStore.user?.uid
      if (userId) {
        const lists = loadLists(userId)
        this.watchLater = lists.watchLater || []
        this.favorites = lists.favorites || []
        this.initialized = true
      }
    },

    toggleWatchLater(movieId) {
      const authStore = useAuthStore()
      const userId = authStore.user?.uid
      if (!userId) return false

      const isInList = this.watchLater.some(item => item.movieId === movieId)

      if (isInList) {
        this.watchLater = this.watchLater.filter(item => item.movieId !== movieId)
      } else {
        this.watchLater.push({
          movieId,
          addedAt: new Date().toISOString()
        })
      }

      saveLists(userId, {
        watchLater: this.watchLater,
        favorites: this.favorites
      })

      return !isInList
    },

    toggleFavorites(movieId) {
      const authStore = useAuthStore()
      const userId = authStore.user?.uid
      if (!userId) return false

      const isInList = this.favorites.some(item => item.movieId === movieId)

      if (isInList) {
        this.favorites = this.favorites.filter(item => item.movieId !== movieId)
      } else {
        this.favorites.push({
          movieId,
          addedAt: new Date().toISOString()
        })
      }

      saveLists(userId, {
        watchLater: this.watchLater,
        favorites: this.favorites
      })

      return !isInList
    },

    clearListsOnLogout() {
      const authStore = useAuthStore()
      const userId = authStore.user?.uid
      if (userId) {
        clearLists(userId)
      }
      this.watchLater = []
      this.favorites = []
      this.initialized = false
    }
  }
})
