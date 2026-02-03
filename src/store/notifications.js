import { defineStore } from 'pinia'

// DISABLED - Notifications require backend API
// This feature is not compatible with the Vue.js SPA + Firebase architecture
// The original implementation made API calls to a backend that doesn't exist

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    lastFetchTime: null
  }),

  actions: {
    async fetchNotifications() {
      // Disabled - requires backend API
      console.warn('Notifications disabled - requires backend API')
      this.notifications = []
      this.unreadCount = 0
    },

    async fetchUnreadCount() {
      // Disabled - requires backend API
      this.unreadCount = 0
    },

    async markAsRead(notificationIds = null) {
      // Disabled - requires backend API
    },

    async deleteNotification(notificationId) {
      // Disabled - requires backend API
    }
  }
})
