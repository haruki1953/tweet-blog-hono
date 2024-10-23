import { systemAdminConfig } from '@/configs'
import { typesAdminStoreSchema } from '@/schemas'
import { generateRandomKey } from '@/utils'
import { defineStoreSystem } from '@/helpers'

const storeDefault = () => {
  return {
    ...systemAdminConfig.storeDefault,
    jwtAdminSecretKey: generateRandomKey()
  }
}

const storeSystem = defineStoreSystem({
  name: 'admin',
  filePath: systemAdminConfig.storeFile,
  storeDefault,
  storeSchema: typesAdminStoreSchema
})

export const store = storeSystem.store
export const save = storeSystem.save

export const loginControlStore: {
  failCount: number
  lockUntil: Date | null
} = {
  failCount: 0,
  lockUntil: null
}
