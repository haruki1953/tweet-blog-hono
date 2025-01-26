import { AppError } from '@/classes'
import {
  type PostUpdateJsonType,
  type PostSendJsonType,
  type PostGetByCursorQueryType,
  type PostGetByIdQueryType,
  type PostDeleteAllQueryType,
  type PostDeleteQueryType
} from '@/schemas'
import { baseFindImageById, baseFindPostById, deleteImageByIdWhereNonePost } from './base'
import { postConfig } from '@/configs'
import { type PostInferSelect } from '@/types'

import { dataDQWPostBaseHandle, dataDQWPostSendHandle, useLogUtil } from '@/utils'
import { drizzleDb, drizzleOrm, drizzleSchema } from '@/db'

const logUtil = useLogUtil()

export const dbQueryWithOnPost = {
  postsToImages: {
    with: {
      image: true
    }
  },
  replies: {
    where: drizzleOrm.eq(drizzleSchema.posts.isDeleted, false),
    columns: {
      id: true
    }
  }
} as const

// src\services\post.ts
// 帖子创建
export const postSendService = async (postInfo: PostSendJsonType) => {
  // 确认图片存在
  if (postInfo.images != null) {
    await Promise.all(postInfo.images.map(async (imgId) => {
      const imgData = await baseFindImageById(imgId)
      if (imgData == null) {
        throw new AppError('图片不存在', 400)
      }
    }))
  }
  // 确认父帖存在
  if (postInfo.parentPostId != null) {
    const postData = await baseFindPostById(postInfo.parentPostId)
    if (postData == null) {
      throw new AppError('父帖不存在', 400)
    }
  }

  const newDate = new Date()

  // 事务
  const post = await drizzleDb.transaction(async (drizzleTx) => {
    // 添加帖子
    const insertedPosts = await drizzleTx.insert(drizzleSchema.posts)
      .values({
        // 时间之类最好手动指定，因为默认值只以秒为精确度
        createdAt: postInfo.createdAt ?? newDate,
        addedAt: newDate,
        updatedAt: newDate,
        content: postInfo.content ?? '',
        imagesOrder: (() => {
          if (postInfo.images == null) {
            return undefined
          }
          return JSON.stringify(postInfo.images)
        })(),
        parentPostId: postInfo.parentPostId,
        isDeleted: postInfo.isDeleted
      })
      .returning()

    if (insertedPosts.length === 0) {
      throw new AppError('帖子添加失败', 500)
    }
    const addedPost = insertedPosts[0]

    // 关联图片
    await (async () => {
      if (postInfo.images == null) {
        return
      }
      await drizzleTx.insert(drizzleSchema.postsToImages)
        .values((() => {
          return postInfo.images.map((imageId) => {
            return {
              postId: addedPost.id,
              imageId
            }
          })
        })())
    })()

    // 最后再次查询帖子数据
    const post = await drizzleDb.query.posts.findFirst({
      where: drizzleOrm.eq(drizzleSchema.posts.id, addedPost.id),
      with: dbQueryWithOnPost
    })
    if (post == null) {
      throw new AppError('帖子添加失败', 500)
    }
    return post
  }).catch((error) => {
    logUtil.info({
      title: '推文添加失败',
      content: String(error)
    })
    throw new AppError('推文添加失败')
  })

  return dataDQWPostSendHandle(post)
}

// src\services\post.ts
// 帖子更新
export const postUpdateService = async (postInfo: PostUpdateJsonType) => {
  // 父帖不能为当前推文
  if (postInfo.id === postInfo.parentPostId) {
    throw new AppError('父帖不能为当前推文', 400)
  }
  // 确认帖子存在
  const targetPost = baseFindPostById(postInfo.id)
  if (targetPost == null) {
    throw new AppError('帖子不存在', 400)
  }
  // 确认图片存在
  if (postInfo.images != null) {
    await Promise.all(postInfo.images.map(async (imgId) => {
      const imgData = await baseFindImageById(imgId)
      if (imgData == null) {
        throw new AppError('图片不存在', 400)
      }
    }))
  }
  // 确认父帖存在
  if (postInfo.parentPostId != null) {
    const postData = await baseFindPostById(postInfo.parentPostId)
    if (postData == null) {
      throw new AppError('父帖不存在', 400)
    }
  }

  const newDate = new Date()

  // 事务
  const post = await drizzleDb.transaction(async (drizzleTx) => {
    // 更新数据
    await drizzleTx.update(drizzleSchema.posts)
      .set({
        // 时间之类最好手动指定，因为默认值只以秒为精确度
        createdAt: postInfo.createdAt,
        updatedAt: newDate,
        content: postInfo.content,
        imagesOrder: (() => {
          if (postInfo.images == null) {
            return undefined
          }
          return JSON.stringify(postInfo.images)
        })(),
        parentPostId: postInfo.parentPostId,
        isDeleted: postInfo.isDeleted
      })
      .where(drizzleOrm.eq(drizzleSchema.posts.id, postInfo.id))
      .returning()

    // 更新图片
    await (async () => {
      if (postInfo.images == null) {
        return
      }
      // 首先清空本帖子与图片的关联
      await drizzleTx.delete(drizzleSchema.postsToImages)
        .where(drizzleOrm.eq(drizzleSchema.postsToImages.postId, postInfo.id))
      // 然后进行关联
      await drizzleTx.insert(drizzleSchema.postsToImages)
        .values((() => {
          return postInfo.images.map((imageId) => {
            return {
              postId: postInfo.id,
              imageId
            }
          })
        })())
    })()

    // 最后再次查询帖子数据
    const post = await drizzleDb.query.posts.findFirst({
      where: drizzleOrm.eq(drizzleSchema.posts.id, postInfo.id),
      with: dbQueryWithOnPost
    })
    if (post == null) {
      throw new AppError('帖子更新失败', 500)
    }
    return post
  }).catch((error) => {
    logUtil.info({
      title: '推文修改失败',
      content: String(error)
    })
    throw new AppError('推文修改失败')
  })

  // 返回响应 类型和帖子发送一致
  return dataDQWPostSendHandle(post)
}

// src\services\post.ts
// 帖子删除
export const postDeleteService = async (id: PostInferSelect['id'], query: PostDeleteQueryType) => {
  // 查找帖子并包含需要的数据
  const targetPost = await drizzleDb.query.posts.findFirst({
    where: drizzleOrm.eq(drizzleSchema.posts.id, id),
    with: dbQueryWithOnPost
  })
  if (targetPost == null) {
    throw new AppError('帖子不存在', 400)
  }
  const post = dataDQWPostBaseHandle(targetPost)

  // 事务
  await drizzleDb.transaction(async (drizzleTx) => {
    // 解除图片关联
    await drizzleTx.delete(drizzleSchema.postsToImages)
      .where(drizzleOrm.eq(drizzleSchema.postsToImages.postId, id))
    // 删除帖子
    await drizzleTx.delete(drizzleSchema.posts)
      .where(drizzleOrm.eq(drizzleSchema.posts.id, id))
  }).catch((error) => {
    logUtil.info({
      title: '推文删除失败',
      content: String(error)
    })
    throw new AppError('推文删除失败')
  })

  // 尝试删除图片
  const deletedImages = await (async () => {
    if (query.delateImage == null || query.delateImage === 'false') {
      return []
    }
    // else (query.delateImage === 'true')
    return await Promise.all(
      post.images.map(async (img) => {
        return await deleteImageByIdWhereNonePost(
          img.id
        ).catch(() => null)
      })
    )
  })()

  return {
    deletedPost: post,
    deletedImages
  }
}

export const postDeleteAllService = async (query: PostDeleteAllQueryType) => {
  // 找到
  const posts = await drizzleDb.query.posts.findMany({
    where: drizzleOrm.eq(drizzleSchema.posts.isDeleted, true),
    columns: { id: true }
  })

  // del one by one, to avert unexpected error
  const results = []
  for (const p of posts) {
    const result = await postDeleteService(p.id, query).catch(() => null)
    if (result == null) {
      continue
    }
    results.push(result)
  }
  return results
}

// TODO
export const postGetByIdService = async (
  id: PostInferSelect['id'], query?: PostGetByIdQueryType
) => {
  const ddWhereDel = (() => {
    if (
      query?.keepIsDetele == null ||
        query.keepIsDetele === 'false'
    ) {
      return drizzleOrm.eq(drizzleSchema.posts.isDeleted, false)
    }
    return undefined
  })()
  const ddWhere = drizzleOrm.and(
    drizzleOrm.eq(drizzleSchema.posts.id, id),
    ddWhereDel
  )

  const post = await drizzleDb.query.posts.findMany({
    where: ddWhere,
    with: {
      ...dbQueryWithOnPost,
      postImports: true,
      postForwards: true,
      parentPost: {
        with: {
          ...dbQueryWithOnPost,
          postImports: true,
          postForwards: true
        }
      }
      // replies: {
      //   whe
      // }
    }
  })
  if (post == null) {
    throw new AppError('推文不存在', 400)
  }
  return post
}

export const postGetByCursorService = async (
  cursorId: PostInferSelect['id'], query: PostGetByCursorQueryType
) => {
  // when cursorId is 0, it's first,
  // skip must be undefined, and cursor is undefined
  const skip = cursorId === '' ? undefined : 1
  const cursor = cursorId === '' ? undefined : { id: cursorId }

  // when have content, filtering contains
  const OR = (
    query.content === undefined
      ? undefined
      : [
          {
            content: { contains: query.content }
          },
          {
            images: {
              some: {
                alt: {
                  contains: query.content
                }
              }
            }
          }
        ]
  )

  let isDeleted: boolean | undefined
  if (
    query.isDelete === 'false' ||
    query.isDelete === undefined
  ) {
    isDeleted = false
  } else if (query.isDelete === 'true') {
    isDeleted = true
  } else { // 'all'
    isDeleted = undefined
  }

  const posts = await prisma.post.findMany({
    take: postConfig.postNumInPage,
    skip,
    cursor,
    where: {
      isDeleted,
      OR
    },
    orderBy: { createdAt: 'desc' },
    include: {
      ...postIncludeBase,
      parentPost: {
        where: { isDeleted },
        include: {
          ...postIncludeBase
        }
      }
    }
  }).catch((error) => {
    logUtil.info({
      title: '推文获取失败',
      content: String(error)
    })
    throw new AppError('推文获取失败')
  })
  return posts
}
