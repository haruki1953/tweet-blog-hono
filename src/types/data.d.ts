import { type LogTypeEnumValues } from '@/configs'
import type { Post as PostPrisma, Image as ImagePrisma, Log as LogPrisma } from '@prisma/client'

export type { PostPrisma, ImagePrisma }

export interface ResData {
  code: number
  message: string
  data?: any
  token?: string
}

export interface Post extends PostPrisma {
  images: Image[]
  _count: {
    replies: number
  }
}

export interface Image extends ImagePrisma {}

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
