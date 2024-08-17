import { AppError } from '@/classes'
import { type PostUpdateJsonType, type PostSendJsonType, type PostGetByCursorQueryType } from '@/schemas'
import { prisma } from '@/systems'
import { deleteImageByIdWhereNonePost } from './base'
import { postConfig } from '@/configs'

export const postSendService = async (postInfo: PostSendJsonType) => {
  const post = await prisma.post.create({
    data: {
      content: postInfo.content ?? '',
      createdAt: postInfo.createdAt,
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
      twitterId: postInfo.twitterId,
      twitterLink: postInfo.twitterLink,
      isDeleted: postInfo.isDeleted
    },
    include: {
      parentPost: true,
      images: true
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
  const post = await prisma.post.update({
    where: { id: postInfo.id },
    data: {
      content: postInfo.content,
      createdAt: postInfo.createdAt,
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
      twitterId: postInfo.twitterId,
      twitterLink: postInfo.twitterLink,
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

export const postDeleteService = async (id: number) => {
  // can direct delete post, prisma can auto manage relation (images)
  const post = await prisma.post.delete({
    where: { id, isDeleted: true },
    include: { images: true }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('帖子不在回收站中', 400)
    }
    throw new AppError('帖子删除失败')
  })

  const imgDelPromises = post.images.map(async (img) => {
    return await deleteImageByIdWhereNonePost(img.id).catch(() => null)
  })

  return {
    deletedPost: post,
    deletedImages: await Promise.all(imgDelPromises)
  }
}

export const postDeleteAllService = async () => {
  const posts = await prisma.post.findMany({
    where: { isDeleted: true },
    select: { id: true }
  })

  // del one by one, to avert unexpected error
  const results = []
  for (const p of posts) {
    const result = await postDeleteService(p.id)
    results.push(result)
  }
  return results
}

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

export const postGetByIdService = async (id: number) => {
  const post = await prisma.post.findUnique({
    where: { id, isDeleted: false },
    include: {
      ...postIncludeBase,
      parentPost: {
        where: { isDeleted: false },
        include: {
          ...postIncludeBase
        }
      },
      replies: {
        where: { isDeleted: false },
        include: {
          ...postIncludeBase,
          replies: {
            where: { isDeleted: false },
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
  cursorId: number, query: PostGetByCursorQueryType
) => {
  const posts = await prisma.post.findMany({
    take: postConfig.postNumInPage,
    skip: (
      cursorId === 0
        ? undefined
        : 1
    ),
    cursor: (
      cursorId === 0
        ? undefined
        : { id: cursorId }
    ),
    where: {
      isDeleted: false,
      content: (
        query.content === undefined
          ? undefined
          : { contains: query.content }
      )
    },
    orderBy: { createdAt: 'desc' },
    include: {
      ...postIncludeBase,
      parentPost: {
        where: { isDeleted: false },
        include: {
          ...postIncludeBase
        }
      }
    }
  })
  return posts
}
