import { baseBlobApi, baseTestApi } from './api'
import { getAgent } from './proxy'

export const useFetchSystem = () => {
  return {
    baseBlobApi,
    baseTestApi,
    getAgent
  }
}
