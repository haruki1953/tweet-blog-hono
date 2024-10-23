import './init'
import {
  confirmAuth,
  updateAuth,
  isAuthDefault,
  getJwtAdminExpSeconds,
  getJwtAdminSecretKey,
  getAdminInfo,
  updateAdminInfo
} from './services'

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
