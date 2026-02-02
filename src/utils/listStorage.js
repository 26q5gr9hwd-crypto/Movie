const getStorageKey = (userId) => danflix_lists_${userId}

export const loadLists = (userId) => {
  try {
    const data = localStorage.getItem(getStorageKey(userId))
    return data ? JSON.parse(data) : { watchLater: [], favorites: [] }
  } catch (e) {
    console.error('Failed to load lists:', e)
    return { watchLater: [], favorites: [] }
  }
}

export const saveLists = (userId, lists) => {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(lists))
    return true
  } catch (e) {
    console.error('Failed to save lists:', e)
    return false
  }
}

export const clearLists = (userId) => {
  localStorage.removeItem(getStorageKey(userId))
}
