import { useAdminSystem, useImageSystem } from '@/systems'
import { generateTokenAdmin } from './base'
import { type AdminUpdateInfoJsonType, type AdminUpdateProxyJsonType } from '@/schemas'

const adminSystem = useAdminSystem()
const imageSystem = useImageSystem()

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
  const isAuthDefault = adminSystem.isAuthDefault()
  const adminInfo = adminSystem.getAdminInfo()
  const proxyInfo = adminSystem.getProxyInfo()
  const imageConfig = imageSystem.getImageConfig()
  return {
    isAuthDefault,
    ...adminInfo,
    ...proxyInfo,
    ...imageConfig
  }
}

export const adminUpdateInfoService = (
  adminInfo: AdminUpdateInfoJsonType
) => {
  adminSystem.updateAdminInfo(adminInfo)
}

export const adminUpdateProxyService = (
  json: AdminUpdateProxyJsonType
) => {
  adminSystem.updateProxyInfo(json)
}
