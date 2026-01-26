import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { useApiStore } from '@/store/api'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Used by src/api/axios.js
export const getCurrentApiUrl = async () => {
  const apiStore = useApiStore()
  return apiStore.currentApiUrl || import.meta.env.VITE_APP_API_URL
}
