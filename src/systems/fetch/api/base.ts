import { fetchProxy } from './dependencies'

export const baseBlobApi = async (url: string) => {
  const response = await fetchProxy(url)
  const blob = await response.blob()
  return blob
}
