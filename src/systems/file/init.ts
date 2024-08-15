import fs from 'fs'
import { AppError } from '@/classes'
import { systemDataPath, systemFileConfig } from '@/configs'
import { type FileStore } from '@/types'
import { confirmSaveFolderExists } from '@/utils'
import { typesFileStoreSchema } from '@/schemas'

let store: null | FileStore = null

const filePath = systemFileConfig.storeFile

const init = () => {
  try {
    confirmSaveFolderExists(systemDataPath)
    confirmSaveFolderExists(systemFileConfig.imageSavePath)
    confirmSaveFolderExists(systemFileConfig.originalImageSavePath)
    confirmSaveFolderExists(systemFileConfig.largeImageSavePath)
    confirmSaveFolderExists(systemFileConfig.smallImageSavePath)
    load()
  } catch (error) {
    throw new AppError('file系统初始化失败')
  }
}

const defaultStore = () => {
  return {
    ...systemFileConfig.storeDefault
  }
}

// load data from file
const load = () => {
  try {
    const dataJson = fs.readFileSync(filePath, 'utf8')
    const dataObj = JSON.parse(dataJson)
    store = typesFileStoreSchema.parse(dataObj)
  } catch (error) {
    store = typesFileStoreSchema.parse(defaultStore())
    const data = JSON.stringify(store, null, 2)
    fs.writeFileSync(filePath, data, 'utf8')
  }
}

init()

const save = () => {
  try {
    // to check before save data
    typesFileStoreSchema.parse(store)
  } catch (error) {
    // save data is illegal, reset data
    const dataJson = fs.readFileSync(filePath, 'utf8')
    const dataObj = JSON.parse(dataJson)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.keys(dataObj).forEach((key) => {
      // Obj"store" can't change, so assignment store's property one by one
      (store as any)[key] = dataObj[key]
    })
    throw new AppError('FileStore修改失败 | 数据不合法')
  }
  const dataStr = JSON.stringify(store, null, 2)
  fs.writeFileSync(filePath, dataStr, 'utf8')
}

export const useSetup = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    store: store as FileStore,
    save
  }
}
