import { defineStore } from 'pinia'

// Simple hash function for passwords
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(16)
}

// Get users from localStorage
function getStoredUsers() {
  const stored = localStorage.getItem('danflix_users')
  return stored ? JSON.parse(stored) : {}
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem('danflix_users', JSON.stringify(users))
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  
  actions: {
    login(username, password) {
      const users = getStoredUsers()
      const userData = users[username]
      
      if (!userData) {
        throw new Error('User not found')
      }
      
      if (userData.passwordHash !== simpleHash(password)) {
        throw new Error('Invalid password')
      }
      
      this.user = { username: username }
      this.token = simpleHash(username + String(Date.now()))
      return true
    },
    
    signup(username, password) {
      const users = getStoredUsers()
      
      if (users[username]) {
        throw new Error('Username already taken')
      }
      
      users[username] = {
        passwordHash: simpleHash(password),
        favorites: [],
        watchLater: []
      }
      
      saveUsers(users)
      
      this.user = { username: username }
      this.token = simpleHash(username + String(Date.now()))
      return true
    },
    
    logout() {
      this.user = null
      this.token = null
    }
  },
  
  persist: true
})
