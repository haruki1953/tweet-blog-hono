import { type PromiseReturnType } from './dependencies'
// 在类型声明文件（.d.ts）中导入的内容不会被编译
import { drizzleDb } from '@/db'
import { dbQueryWithOnImage, dbQueryWithOnPost } from '@/services'

// src\types\data\db-query-with.d.ts
// 为了推断类型而使用的临时函数
const fnDQWPostData = async () => {
  return await drizzleDb.query.posts.findFirst({
    with: dbQueryWithOnPost
  })
}
const fnDQWImageData = async () => {
  return await drizzleDb.query.images.findFirst({
    with: dbQueryWithOnImage
  })
}

// 帖子数据库查询的基本类型
export type DQWPostData = NonNullable<PromiseReturnType<typeof fnDQWPostData>>

// 图片数据库查询的基本类型
export type DQWImageData = NonNullable<PromiseReturnType<typeof fnDQWImageData>>
