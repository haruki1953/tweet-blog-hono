import { AppError } from '@/classes'
import {
  type PostUpdateJsonType,
  type PostSendJsonType,
  type PostGetByCursorQueryType,
  type PostGetByIdQueryType,
  type PostDeleteAllQueryType,
  type PostDeleteQueryType
} from '@/schemas'
import { prisma } from '@/systems'
import { deleteImageByIdWhereNonePost } from './base'
import { postConfig } from '@/configs'
import { type PromiseReturnType } from '@prisma/client/extension'
import { type PostPrisma } from '@/types'

const postIncludeBase = {
  images: true,
  _count: {
    select: {
      replies: {
        where: { isDeleted: false }
      }
    }
  }
}

export const postSendService = async (postInfo: PostSendJsonType) => {
  const post = await prisma.post.create({
    data: {
      content: postInfo.content ?? '',
      createdAt: postInfo.createdAt,
      imagesOrder: (
        postInfo.images === undefined
          ? undefined
          : (
              JSON.stringify(postInfo.images)
            )
      ),
      images: (
        postInfo.images === undefined
          ? undefined
          : (
              {
                connect: postInfo.images.map((id) => {
                  return { id }
                })
              }
            )
      ),
      parentPost: (
        postInfo.parentPostId == null
          ? undefined
          : ({ connect: { id: postInfo.parentPostId } })
      ),
      // twitterId: postInfo.twitterId,
      // twitterLink: postInfo.twitterLink,
      isDeleted: postInfo.isDeleted
    },
    include: {
      ...postIncludeBase
    }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('images或parentPostId不存在', 400)
    }
    throw new AppError('帖子发送失败')
  })
  return post
}

export const postUpdateService = async (postInfo: PostUpdateJsonType) => {
  if (postInfo.id === postInfo.parentPostId) {
    throw new AppError('parentPostId 不能为当前帖子 id', 400)
  }
  const post = await prisma.post.update({
    where: { id: postInfo.id },
    data: {
      content: postInfo.content,
      createdAt: postInfo.createdAt,
      imagesOrder: (
        postInfo.images === undefined
          ? undefined
          : (
              JSON.stringify(postInfo.images)
            )
      ),
      images: (
        postInfo.images === undefined
          ? undefined
          : (
              {
                set: postInfo.images.map((id) => {
                  return { id }
                })
              }
            )
      ),
      parentPost: (
        postInfo.parentPostId === undefined
          ? undefined
          : (
              postInfo.parentPostId === null
                ? ({ disconnect: true })
                : ({ connect: { id: postInfo.parentPostId } })
            )
      ),
      // twitterId: postInfo.twitterId,
      // twitterLink: postInfo.twitterLink,
      isDeleted: postInfo.isDeleted
    },
    include: {
      parentPost: true,
      images: true
    }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('帖子id、images或parentPostId不存在', 400)
    }
    throw new AppError('帖子修改失败')
  })
  return post
}

export const postDeleteService = async (id: PostPrisma['id'], query: PostDeleteQueryType) => {
  // can direct delete post, prisma can auto manage relation (images)
  const post = await prisma.post.delete({
    where: { id, isDeleted: true },
    include: { images: true }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('帖子不在回收站中', 400)
    }
    console.log(error)
    throw new AppError('帖子删除失败')
  })

  const tryDeleteImages = async () => {
    const imgDelPromises = post.images.map(async (img) => {
      return await deleteImageByIdWhereNonePost(img.id).catch(() => null)
    })
    return await Promise.all(imgDelPromises)
  }
  let deletedImages: PromiseReturnType<typeof tryDeleteImages> = []
  if (query.delateImage === 'true') {
    deletedImages = await tryDeleteImages()
  }

  return {
    deletedPost: post,
    deletedImages
  }
}

export const postDeleteAllService = async (query: PostDeleteAllQueryType) => {
  const posts = await prisma.post.findMany({
    where: { isDeleted: true },
    select: { id: true }
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

export const postGetByIdService = async (
  id: PostPrisma['id'], query: PostGetByIdQueryType
) => {
  let isDelWhereVal: false | undefined
  if (
    query.keepIsDetele === undefined ||
    // eslint-disable-next-line @typescript-eslint/quotes
    query.keepIsDetele === "false"
  ) {
    isDelWhereVal = false
  } else { // true
    isDelWhereVal = undefined
  }

  const post = await prisma.post.findUnique({
    where: { id, isDeleted: isDelWhereVal },
    include: {
      ...postIncludeBase,
      postImports: true,
      postForwards: true,
      parentPost: {
        where: { isDeleted: isDelWhereVal },
        include: {
          ...postIncludeBase
        }
      },
      replies: {
        where: { isDeleted: isDelWhereVal },
        include: {
          ...postIncludeBase,
          replies: {
            where: { isDeleted: isDelWhereVal },
            include: {
              ...postIncludeBase
            }
          }
        }
      }
    }
  })
  if (post == null) {
    throw new AppError('帖子不存在', 400)
  }
  return post
}

export const postGetByCursorService = async (
  cursorId: PostPrisma['id'], query: PostGetByCursorQueryType
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
  })
  return posts
}
