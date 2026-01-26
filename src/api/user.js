import { auth } from '@/firebase/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import { getApi } from '@/api/axios'

// ============ FIREBASE AUTH ============
// Convert username to fake email (Firebase requires email, but users only see username)
const usernameToEmail = (username) => `${username.toLowerCase()}@movies.local`

const signup = async ({ username, password }) => {
  const email = usernameToEmail(username)
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const token = await cred.user.getIdToken()

  return {
    token,
    user: {
      id: cred.user.uid,
      username: username.trim()
    }
  }
}

const login = async ({ username, password }) => {
  const email = usernameToEmail(username)
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const token = await cred.user.getIdToken()

  return {
    token,
    user: {
      id: cred.user.uid,
      username: username.trim()
    }
  }
}

const logout = async () => {
  await signOut(auth)
}

const getUser = async () => {
  const user = auth.currentUser
  if (!user) return null
  return {
    id: user.uid
  }
}

// ============ ORIGINAL LIST API (uses old backend) ============
const apiCall = async (callFn) => {
  const api = await getApi()
  return await callFn(api)
}

const addToList = async (id, type) => {
  const { data } = await apiCall((api) => api.put(`/list/${type}/${id}`))
  return data
}

const delFromList = async (id, type) => {
  const { data } = await apiCall((api) => api.delete(`/list/${type}/${id}`))
  return data
}

const delAllFromList = async (type) => {
  const { data } = await apiCall((api) => api.delete(`/list/${type}`))
  return data
}

const getMyLists = async (type) => {
  const { data } = await apiCall((api) => api.get(`/list/${type}`))
  return data
}

const getUserLists = async (type, userId) => {
  const { data } = await apiCall((api) => api.get(`/user-list/${userId}/${type}`))
  return data
}

const getListCounters = async (userId) => {
  const { data } = await apiCall((api) => api.get(`/user-list-counters/${userId}`))
  return data
}

const updateUserName = async (name) => {
  const { data } = await apiCall((api) => api.put('/user/name', { name }))
  return data
}

export {
  // Auth (Firebase)
  signup,
  login,
  logout,
  getUser,

  // Lists (original backend)
  addToList,
  delFromList,
  delAllFromList,
  getMyLists,
  getUserLists,
  getListCounters,
  updateUserName
}
