import { useSetup } from './init'
import { confirmAuth, updateAuth } from './srevices'

useSetup()

export const useAdminSystem = () => {
  return {
    confirmAuth,
    updateAuth
  }
}
