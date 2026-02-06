import { getApi } from './axios'

export const getMyLists = async (listType) => {
  const api = await getApi()
  const { data } = await api.get('/user/lists/' + listType)
  return data
}

export const delAllFromList = async (listType) => {
  const api = await getApi()
  const { data } = await api.delete('/user/lists/' + listType)
  return data
}

export const addToList = async (listType, item) => {
  const api = await getApi()
  const { data } = await api.post('/user/lists/' + listType, item)
  return data
}

export const delFromList = async (listType, itemId) => {
  const api = await getApi()
  const { data } = await api.delete('/user/lists/' + listType + '/' + itemId)
  return data
}
