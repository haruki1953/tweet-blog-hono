import { prisma, useAdminSystem, useFetchSystem, useImageSystem, useTaskSystem } from '@/systems'
import { type AdminLogGetByCursorParamType, type AdminLogGetByCursorQueryType, type AdminProxyTestJsonType, type AdminUpdateInfoJsonType, type AdminUpdateProxyJsonType } from '@/schemas'
import { AppError } from '@/classes'
import { useLogUtil } from '@/utils'
import { logConfig, logTypeMap } from '@/configs'
import { sign } from 'hono/jwt'

const adminSystem = useAdminSystem()
const imageSystem = useImageSystem()
const fetchSystem = useFetchSystem()
const taskSystem = useTaskSystem()
const logUtil = useLogUtil()

export const generateTokenAdmin = async (
  payloadStr: string
) => {
  const payload = {
    payloadStr,
    exp: Math.floor(Date.now() / 1000) + adminSystem.getJwtAdminExpSeconds()
  }
  const token = await sign(payload, adminSystem.getJwtAdminSecretKey())
  return token
}

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
  logUtil.info({
    content: '账号密码已更新'
  })
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
  }).catch((error) => {
    logUtil.info({
      title: '日志获取失败',
      content: String(error)
    })
    throw new AppError('日志获取失败')
  })
  return logs
}

// 日志清理
export const adminLogDeleteService = async (num: number) => {
  // 查询前 num 条记录
  const topNumLogs = await prisma.log.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: num
  }).catch((error) => {
    logUtil.info({
      title: '日志查询失败',
      content: String(error)
    })
    throw new AppError('日志查询失败')
  })

  // 删除不在前 num 条记录中的所有其他记录
  const { count } = await prisma.log.deleteMany({
    where: {
      id: {
        notIn: topNumLogs.map(i => i.id)
      }
    }
  }).catch((error) => {
    logUtil.info({
      title: '日志删除失败',
      content: String(error)
    })
    throw new AppError('日志删除失败')
  })
  return {
    count
  }
}

export const adminGetTaskService = () => {
  const taskStore = taskSystem.taskStore()
  return {
    taskStore
  }
}

export const adminTaskAbortService = (uuid: string) => {
  taskSystem.taskAbort(uuid)
  return adminGetTaskService()
}

export const adminTaskDeleteService = (uuid: string) => {
  taskSystem.taskDelete(uuid)
  return adminGetTaskService()
}
