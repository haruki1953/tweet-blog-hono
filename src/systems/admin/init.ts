import fs from 'fs'
import { systemAdminConfig, systemDataPath } from '@/configs'
import type { AdminStore } from '@/types'
import { typesAdminStoreSchema } from '@/schemas'
import { confirmSaveFolderExists, generateRandomKey } from '@/utils'
import { AppError } from '@/classes'

let store: null | AdminStore = null

const filePath = systemAdminConfig.storeFile

const init = () => {
  try {
    confirmSaveFolderExists(systemDataPath)
    load()
  } catch (error) {
    throw new AppError('admin系统初始化失败')
  }
}

// load data from file
const load = () => {
  try {
    const dataJson = fs.readFileSync(filePath, 'utf8')
    const dataObj = JSON.parse(dataJson)
    store = typesAdminStoreSchema.parse(dataObj)
  } catch (error) {
    store = {
      username: 'admin',
      password: '123456',
      jwtMainSecretKey: generateRandomKey(),
      jwtAdminSecretKey: generateRandomKey()
    }
    save()
  }
}

const save = () => {
  const data = JSON.stringify(store, null, 2)
  fs.writeFileSync(filePath, data, 'utf8')
}

init()

export const useSetup = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    store: store as AdminStore,
    save
  }
}
