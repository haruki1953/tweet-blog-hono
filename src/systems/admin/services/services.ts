import { AppError } from '@/classes'
import { store, save } from '../init'
import { canAttemptLogin, recordLoginFailure, resetLoginControl } from './login-control'
import { systemAdminConfig } from '@/configs'
import { generateRandomKey } from '@/utils'

export const confirmAuth = (username: string, password: string) => {
  if (!canAttemptLogin()) {
    throw new AppError('多次登录失败，已锁定', 400, 1002)
  }
  if (
    username !== store.username ||
    password !== store.password
  ) {
    recordLoginFailure()
    throw new AppError('用户名或密码错误', 400, 1001)
  }
  resetLoginControl()
}

export const updateAuth = (username: string, password: string) => {
  // 要重置密钥
  save({
    ...store,
    username,
    password,
    jwtAdminSecretKey: generateRandomKey()
  })
}

export const isAuthDefault = () => {
  const storeDefaultVal = systemAdminConfig.storeDefault()
  if (
    store.username === storeDefaultVal.username &&
    store.password === storeDefaultVal.password
  ) {
    return true
  }
  return false
}

export const getJwtAdminSecretKey = () => {
  return store.jwtAdminSecretKey
}

export const getJwtAdminExpSeconds = () => {
  return store.jwtAdminExpSeconds
}

export const getAdminInfo = () => {
  return {
    jwtAdminExpSeconds: store.jwtAdminExpSeconds,
    loginMaxFailCount: store.loginMaxFailCount,
    loginLockSeconds: store.loginLockSeconds
  }
}

export const updateAdminInfo = (
  info: {
    jwtAdminExpSeconds: number
    loginMaxFailCount: number
    loginLockSeconds: number
  }
) => {
  save({
    ...store,
    ...info
  })
}
