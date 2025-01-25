import { type LogTypeEnumValues } from '@/configs'
import { type PromiseReturnType } from './util'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { drizzleDb, drizzleSchema } from '@/db'

// 为了推断类型而使用的临时函数
const fnImageInferQueryWithPostArray = async () => {
  return await drizzleDb.query.images.findMany({
    with: {
      postsToImages: {
        with: {
          post: true
        }
      }
    }
  })
}

export type ImageInferQueryWithPost = PromiseReturnType<typeof fnImageInferQueryWithPostArray>[number]

export type PostInferSelect = typeof drizzleSchema.posts.$inferSelect
export type ImageInferSelect = typeof drizzleSchema.images.$inferSelect

export interface ResData {
  code: number
  message: string
  data?: any
  token?: string
}

export interface Post extends PostInferSelect {
  images: Image[]
  _count: {
    replies: number
  }
}

export interface Image extends ImageInferSelect {}

export type PostGetByIdData = Post & {
  parentPost: Post | null
  replies: Array<Post & {
    replies: Post[]
  }>
}

export type PostGetByCursorData = Array<Post & {
  parentPost: Post | null
}>

export interface LogData extends LogPrisma {
  type: LogTypeEnumValues
}
