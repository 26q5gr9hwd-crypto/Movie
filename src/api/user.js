import { supabase } from '@/lib/supabase'

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

export {
  signup,
  login,
  logout,
  getUser
}
