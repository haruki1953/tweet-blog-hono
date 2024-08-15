import { AppError } from '@/classes'
import { useSetup } from './init'
import { canAttemptLogin, recordLoginFailure, resetLoginControl } from './login-control'
import { systemAdminConfig } from '@/configs'

const setup = useSetup()

export const confirmAuth = (username: string, password: string) => {
  if (!canAttemptLogin()) {
    throw new AppError('多次登录失败，已锁定', 400, 1002)
  }
  if (
    username !== setup.store.username ||
    password !== setup.store.password
  ) {
    recordLoginFailure()
    throw new AppError('用户名或密码错误', 400, 1001)
  }
  resetLoginControl()
}

export const updateAuth = (username: string, password: string) => {
  setup.store.username = username
  setup.store.password = password
  setup.save()
}

export const isAuthDefault = () => {
  if (
    setup.store.username === systemAdminConfig.storeDefault.username &&
    setup.store.password === systemAdminConfig.storeDefault.password
  ) {
    return true
  }
  return false
}

export const getJwtAdminSecretKey = () => {
  return setup.store.jwtAdminSecretKey
}

export const getJwtAdminExpSeconds = () => {
  return setup.store.jwtAdminExpSeconds
}

export const getAdminInfo = () => {
  return {
    jwtAdminExpSeconds: setup.store.jwtAdminExpSeconds,
    loginMaxFailCount: setup.store.loginMaxFailCount,
    loginLockSeconds: setup.store.loginLockSeconds
  }
}

export const updateAdminInfo = (
  info: {
    jwtAdminExpSeconds: number
    loginMaxFailCount: number
    loginLockSeconds: number
  }
) => {
  setup.store.jwtAdminExpSeconds = info.jwtAdminExpSeconds
  setup.store.loginMaxFailCount = info.loginMaxFailCount
  setup.store.loginLockSeconds = info.loginLockSeconds
  setup.save()
}
