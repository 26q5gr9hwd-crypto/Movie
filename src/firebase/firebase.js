import { initializeApp } from 'firebase/app'
import { useApiStore } from '@/store/api'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const auth = getAuth(initializeApp(firebaseConfig))

// Firebase Auth REMOVED - new auth will use simple localStorage
// export const auth = getAuth(app)

// Used by src/api/axios.js
export const getCurrentApiUrl = async () => {
  const apiStore = useApiStore()
  return apiStore.currentApiUrl || import.meta.env.VITE_APP_API_URL
}

// ================= Remote Config (lightweight stub) =================
// index.html expects these exports. This keeps the build working even if you
// don't actually use Firebase Remote Config yet.
let __remoteConfigCache = {
  load_script: 'false'
}

export const initRemoteConfig = async () => {
  // If you later want real Firebase Remote Config, we can replace this stub.
  return true
}

export const getConfigValue = (key) => {
  return __remoteConfigCache?.[key]
}
