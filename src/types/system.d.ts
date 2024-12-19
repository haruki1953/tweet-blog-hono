import { type typesFileStoreSchema, type typesAdminStoreSchema, type typesProfileStoreSchema, type typesForwardStoreSchema, type forwardSettingItemSchema, type forwardSettingItemForSetSchema, type forwardSettingBaseSchema, type forwardSettingXSchema, type forwardSettingTSchema } from '@/schemas'
import { type z } from 'zod'

export type AdminStore = z.infer<typeof typesAdminStoreSchema>
// {
//   username: string
//   password: string
//   jwtAdminSecretKey: string
//   jwtAdminExpSeconds: number
//   loginMaxFailCount: number
//   loginLockSeconds: number
// }

export type FileStore = z.infer<typeof typesFileStoreSchema>

export type ProfileStore = z.infer<typeof typesProfileStoreSchema>

export interface TaskCache {
  importTaskList: Array<{
    uuid: string
    startAt: string
    totalCount: number
    completedCount: number
  }>
}

export type ForwardStore = z.infer<typeof typesForwardStoreSchema>
export type ForwardSettingItem = z.infer<typeof forwardSettingItemSchema>
export type ForwardSettingItemForSet = z.infer<typeof forwardSettingItemForSetSchema>

export type ForwardSettingBase = z.infer<typeof forwardSettingBaseSchema>
export type ForwardSettingX = z.infer<typeof forwardSettingXSchema>
export type ForwardSettingT = z.infer<typeof forwardSettingTSchema>
