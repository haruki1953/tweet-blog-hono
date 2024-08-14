import { useSetup } from './init'

const setup = useSetup()

export const canAttemptLogin = () => {
  const { lockUntil } = setup.loginControlStore

  if ((lockUntil != null) && new Date() < lockUntil) {
    return false // 仍在锁定期内
  }

  return true // 可以尝试登录
}

export const recordLoginFailure = () => {
  setup.loginControlStore.failCount += 1
  if (setup.loginControlStore.failCount >= setup.store.loginMaxFailCount) {
    setup.loginControlStore.failCount = 0
    setup.loginControlStore.lockUntil =
    new Date(new Date().getTime() + setup.store.loginLockSeconds * 1000) // 锁定一段时间
  }
}

export const resetLoginControl = () => {
  setup.loginControlStore.failCount = 0
  setup.loginControlStore.lockUntil = null
}
