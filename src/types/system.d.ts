import { type forwardSettingItemForSetSchema, type forwardSettingItemSchema, type typesAdminStoreSchema, type typesForwardStoreSchema, type typesProfileStoreSchema, type typesFileStoreSchema } from '@/schemas'
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

// 通过传入平台所代表字段类型，来获取对应的类型
type ExtractPlatform<
  Platform extends PlatformKeyEnumValues, Item
> = Item extends { platform: Platform } ? Item : never
export type ForwardSettingPlatform<
  Platform extends PlatformKeyEnumValues
> = ExtractPlatform<Platform, ForwardSettingItem>

// 测试
// type x = ForwardSettingPlatform<'X'>
