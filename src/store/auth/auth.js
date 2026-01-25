import { defineStore } from 'pinia'
import { AUTH_STORE_NAME } from '../constants'
import { getUser } from '@/api/user'

export const useAuthStore = defineStore(AUTH_STORE_NAME, {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user
  },

  actions: {
    setUser(user) {
      this.user = user
    },
    setToken(token) {
      this.token = token
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    },
    setSession(session) {
      // Compatibility method - extracts token from session object
      if (session?.access_token) {
        this.setToken(session.access_token)
      }
    },
    logout() {
      this.user = null
      this.setToken(null)
    },
    async initAuth() {
      // Check for existing token on app load
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        try {
          // Verify token is still valid by fetching user
          const userData = await getUser()
          this.user = userData.user || userData
        } catch {
          // Token invalid, clear it
          this.logout()
        }
      }
    }
  },

  persist: {
    key: AUTH_STORE_NAME,
    pick: ['user', 'token']
  }
})
