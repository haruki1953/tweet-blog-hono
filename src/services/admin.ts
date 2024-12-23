import { prisma, useAdminSystem, useFetchSystem, useImageSystem } from '@/systems'
import { generateTokenAdmin } from './base'
import { type AdminLogGetByCursorParamType, type AdminLogGetByCursorQueryType, type AdminProxyTestJsonType, type AdminUpdateInfoJsonType, type AdminUpdateProxyJsonType } from '@/schemas'
import { AppError } from '@/classes'
import { useTaskSystem } from '@/systems/task'
import { useLogUtil } from '@/utils'
import { logConfig, logTypeMap } from '@/configs'

const adminSystem = useAdminSystem()
const imageSystem = useImageSystem()
const fetchSystem = useFetchSystem()
const taskSystem = useTaskSystem()
const logUtil = useLogUtil()

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
  return await fetchSystem.baseTestApi(json.testAddress).catch((error) => {
    logUtil.info({
      title: '网络测试失败',
      content: String(error)
    })
    throw new AppError('测试失败')
  })
}

export const adminGetTaskService = () => {
  const taskCache = taskSystem.taskCache()
  return {
    taskCache
  }
}

// 日志分页查询
export const adminLogGetByCursorService = async (
  cursorId: AdminLogGetByCursorParamType['id'], query: AdminLogGetByCursorQueryType
) => {
  const skip = cursorId == null ? undefined : 1
  const cursor = cursorId == null ? undefined : { id: cursorId }
  const typeQueryList = (() => {
    const typeList = []
    if (query.error !== 'false') {
      typeList.push(logTypeMap.error.key)
    }
    if (query.warning !== 'false') {
      typeList.push(logTypeMap.warning.key)
    }
    if (query.success !== 'false') {
      typeList.push(logTypeMap.success.key)
    }
    if (query.info !== 'false') {
      typeList.push(logTypeMap.info.key)
    }
    return typeList
  })()
  const logs = await prisma.log.findMany({
    take: logConfig.logCursorTakeNum,
    skip,
    cursor,
    where: {
      type: {
        in: typeQueryList
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return logs
}
