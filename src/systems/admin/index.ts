import { useSetup } from './init'
import {
  confirmAuth,
  updateAuth,
  isAuthDefault,
  getJwtAdminExpSeconds,
  getJwtAdminSecretKey,
  getAdminInfo,
  updateAdminInfo
} from './srevices'

useSetup()

export const useAdminSystem = () => {
  return {
    confirmAuth,
    updateAuth,
    isAuthDefault,
    getJwtAdminSecretKey,
    getJwtAdminExpSeconds,
    getAdminInfo,
    updateAdminInfo
  }
}
