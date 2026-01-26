import { auth } from '@/firebase/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

// Convert username to fake email (users never see this)
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
    id: user.uid,
    // username is not stored automatically; we keep the one in local store
  }
}
