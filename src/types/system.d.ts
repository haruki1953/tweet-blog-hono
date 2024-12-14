import { type typesFileStoreSchema, type typesAdminStoreSchema, type typesProfileStoreSchema } from '@/schemas'
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
