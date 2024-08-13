import { AppError } from '@/classes'
import { useSetup } from './init'

const setup = useSetup()

export const confirmAuth = (username: string, password: string) => {
  if (
    username !== setup.store.username ||
    password !== setup.store.password
  ) {
    throw new AppError('用户名或密码错误', 400)
  }
}

export const updateAuth = (username: string, password: string) => {
  setup.store.username = username
  setup.store.password = password
  setup.save()
}
