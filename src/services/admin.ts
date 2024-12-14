import { useAdminSystem, useFetchSystem, useImageSystem } from '@/systems'
import { generateTokenAdmin } from './base'
import { type AdminProxyTestJsonType, type AdminUpdateInfoJsonType, type AdminUpdateProxyJsonType } from '@/schemas'
import { AppError } from '@/classes'

const adminSystem = useAdminSystem()
const imageSystem = useImageSystem()
const fetchSystem = useFetchSystem()

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

export const adminProxyTestService = async (
  json: AdminProxyTestJsonType
) => {
  return await fetchSystem.baseTestApi(json.testAddress).catch(() => {
    throw new AppError('测试失败')
  })
}
