import fs from 'fs'
import { systemAdminConfig, systemDataPath } from '@/configs'
import type { AdminStore } from '@/types'
import { typesAdminStoreSchema } from '@/schemas'
import { confirmSaveFolderExists, generateRandomKey } from '@/utils'
import { AppError } from '@/classes'

let store: null | AdminStore = null

const loginControlStore: {
  failCount: number
  lockUntil: Date | null
} = {
  failCount: 0,
  lockUntil: null
}

const filePath = systemAdminConfig.storeFile

const init = () => {
  try {
    confirmSaveFolderExists(systemDataPath)
    load()
  } catch (error) {
    throw new AppError('admin系统初始化失败')
  }
}

const defaultStore = () => {
  return {
    ...systemAdminConfig.storeDefault,
    jwtAdminSecretKey: generateRandomKey()
  }
}

// load data from file
const load = () => {
  try {
    const dataJson = fs.readFileSync(filePath, 'utf8')
    const dataObj = JSON.parse(dataJson)
    store = typesAdminStoreSchema.parse(dataObj)
  } catch (error) {
    store = typesAdminStoreSchema.parse(defaultStore())
    const data = JSON.stringify(store, null, 2)
    fs.writeFileSync(filePath, data, 'utf8')
  }
}

init()

const save = () => {
  try {
    // to check before save data
    typesAdminStoreSchema.parse(store)
  } catch (error) {
    // save data is illegal, reset data
    const dataJson = fs.readFileSync(filePath, 'utf8')
    const dataObj = JSON.parse(dataJson)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.keys(dataObj).forEach((key) => {
      // Obj"store" can't change, so assignment store's property one by one
      (store as any)[key] = dataObj[key]
    })
    throw new AppError('AdminStore修改失败 | 数据不合法')
  }
  const dataStr = JSON.stringify(store, null, 2)
  fs.writeFileSync(filePath, dataStr, 'utf8')
}

export const useSetup = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    store: store as AdminStore,
    loginControlStore,
    save
  }
}
