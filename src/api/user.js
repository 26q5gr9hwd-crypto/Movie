import { supabase } from '@/lib/supabase'
import { getApi } from '@/api/axios'

// ============ SUPABASE AUTH ============
const signup = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

const logout = async () => {
  await supabase.auth.signOut()
}

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
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
  // Auth (Supabase)
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
