import { AppError } from '@/classes'
import { systemDataPath, systemFileConfig } from '@/configs'
import { confirmSaveFolderExists } from '@/utils'
import { typesFileStoreSchema } from '@/schemas'
import { defineStoreSystem } from '@/helpers/system'

try {
  confirmSaveFolderExists(systemDataPath)
  confirmSaveFolderExists(systemFileConfig.imageSavePath)
  confirmSaveFolderExists(systemFileConfig.originalImageSavePath)
  confirmSaveFolderExists(systemFileConfig.largeImageSavePath)
  confirmSaveFolderExists(systemFileConfig.smallImageSavePath)
} catch (error) {
  throw new AppError('image 路径初始化失败')
}

const storeDefault = () => {
  return {
    ...systemFileConfig.storeDefault
  }
}

const storeSystem = defineStoreSystem({
  name: 'file',
  filePath: systemFileConfig.storeFile,
  storeDefault,
  storeSchema: typesFileStoreSchema
})

export const store = storeSystem.store
export const save = storeSystem.save
