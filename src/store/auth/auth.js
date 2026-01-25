import { defineStore } from 'pinia'
import { AUTH_STORE_NAME } from '../constants'
import { supabase } from '@/lib/supabase'
import { logout as logoutApi } from '@/api/user'

export const useAuthStore = defineStore(AUTH_STORE_NAME, {
  state: () => ({
    session: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.session && !!state.user,
    token: (state) => state.session?.access_token || null
  },

  actions: {
    setUser(user) {
      this.user = user
    },
    setSession(session) {
      this.session = session
    },
    async logout() {
      await logoutApi()
      this.user = null
      this.session = null
    },
    async initAuth() {
      // Check for existing session on app load
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        this.session = session
        this.user = session.user
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        this.session = session
        this.user = session?.user || null
      })
    }
  },

  persist: {
    key: AUTH_STORE_NAME,
    pick: ['session', 'user']
  }
})
