import { getApi } from './axios'

export const getMyLists = async (listType) => {
  const api = await getApi()
  const { data } = await api.get('/user/lists/' + listType)
  return data
}

export const addToList = async (kpId, listType) => {
  const api = await getApi()
  const { data } = await api.post('/user/lists/' + listType + '/' + kpId)
  return data
}

export const delFromList = async (kpId, listType) => {
  const api = await getApi()
  const { data } = await api.delete('/user/lists/' + listType + '/' + kpId)
  return data
}

export const delAllFromList = async (listType) => {
  const api = await getApi()
  const { data } = await api.delete('/user/lists/' + listType)
  return data
}
