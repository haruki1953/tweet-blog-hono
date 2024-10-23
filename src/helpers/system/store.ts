import fs from 'fs'
import { type z } from 'zod'
import { AppError } from '@/classes'
import { systemDataPath } from '@/configs'
import { confirmSaveFolderExists } from '@/utils'

export const defineStoreSystem = <
  StoreSchema extends ReturnType<typeof z.object>
>(dependencies: {
    name: string
    filePath: string
    storeDefault: () => z.infer<StoreSchema>
    storeSchema: StoreSchema
  }) => {
  const { name, filePath, storeDefault, storeSchema } = dependencies

  const init = () => {
    try {
      confirmSaveFolderExists(systemDataPath)
      const store = load()
      return {
        store
      }
    } catch (error) {
      throw new AppError(`${name} 系统初始化失败`)
    }
  }

  // load data from file
  const load = () => {
    try {
      const dataJson = fs.readFileSync(filePath, 'utf8')
      const dataObj = JSON.parse(dataJson)
      return storeSchema.parse(dataObj)
    } catch (error) {
      const defaultData = storeSchema.parse(storeDefault())
      const data = JSON.stringify(defaultData, null, 2)
      fs.writeFileSync(filePath, data, 'utf8')
      return defaultData
    }
  }

  const save = (newStore: z.infer<StoreSchema>) => {
    try {
      // to check before save data
      storeSchema.parse(newStore)
      // update store
      Object.keys(newStore).forEach((key) => {
        (store as any)[key] = newStore[key]
      })
      // save json
      const dataStr = JSON.stringify(newStore, null, 2)
      fs.writeFileSync(filePath, dataStr, 'utf8')
    } catch (error) {
      // save data is illegal
      throw new AppError(`${name} 系统修改失败`)
    }
  }

  const initInfo = init()

  const store: z.infer<StoreSchema> = initInfo.store

  return {
    store,
    save
  }
}
