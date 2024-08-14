import { useAdminSystem } from '@/systems'
import { generateTokenAdmin } from './base'

const adminSystem = useAdminSystem()

export const adminLoginService = async (
  username: string, password: string
) => {
  adminSystem.confirmAuth(username, password)
  const token = await generateTokenAdmin(username)
  return `Bearer ${token}`
}

export const adminUpdateAuthService = (
  username: string, password: string
) => {
  adminSystem.updateAuth(username, password)
}

export const adminGetInfoService = () => {
  const adminInfo = adminSystem.getAdminInfo()
  const isAuthDefault = adminSystem.isAuthDefault()
  return {
    ...adminInfo,
    isAuthDefault
  }
}

export const adminUpdateInfoService = (
  adminInfo: {
    jwtAdminExpSeconds: number
    loginMaxFailCount: number
    loginLockSeconds: number
  }
) => {
  adminSystem.updateAdminInfo(adminInfo)
}
