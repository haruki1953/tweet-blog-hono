import { AppError } from '@/classes'
import { type ImageGetByCursorQueryType, type ImageUpdateConfigJsonType, type ImageUpdateJsonType } from '@/schemas'
import { prisma, useImageSystem } from '@/systems'
import { deleteImageByIdWhereNonePost } from './base'
import { postConfig } from '@/configs'
import { type ImagePrisma } from '@/types'

import fetch from 'node-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'

const imageSystem = useImageSystem()

export const imageSendService = async (
  imageFile: File | Blob
) => {
  const {
    path,
    originalPath,
    smallSize,
    largeSize,
    originalSize
  } = await imageSystem.processImage(imageFile)

  return await prisma.image.create({
    data: {
      path,
      originalPath,
      smallSize,
      largeSize,
      originalSize
    }
  })
}

export const imageSendByUrlService = async (
  imageUrl: string
) => {
  const imageBlob = await imageUrlToBlob(imageUrl)
  return await imageSendService(imageBlob)
}

const imageUrlToBlob = async (url: string) => {
  // 暂时试验，之后完成代理设置接口后完善
  const response = await fetch(url, {
    agent: new HttpsProxyAgent('http://127.0.0.1:10809/')
  }).catch(() => {
    throw new AppError('图片获取失败', 500)
    // throw error
  })
  const blob = await response.blob()
  return blob
}

export const imageUpdateService = async (
  imageInfo: ImageUpdateJsonType
) => {
  const image = await prisma.image.update({
    where: {
      id: imageInfo.id
    },
    data: {
      alt: imageInfo.alt
      // twitterLargeImageLink: imageInfo.twitterLargeImageLink
    }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('imageId不存在')
    }
    throw new AppError('图片修改失败')
  })
  return image
}

export const imageGetConfigService = () => {
  return imageSystem.getImageConfig()
}

export const imageUpdateConfigService = (
  configInfo: ImageUpdateConfigJsonType
) => {
  imageSystem.updateImageConfig(configInfo)
}

export const imageDeleteService = async (id: ImagePrisma['id']) => {
  return await deleteImageByIdWhereNonePost(id)
}

export const imageDeleteAllService = async () => {
  const images = await prisma.image.findMany({
    where: { posts: { none: {} } }
  })

  const imgDelPromises = images.map(async (img) => {
    return await deleteImageByIdWhereNonePost(img.id).catch(() => null)
  })

  return await Promise.all(imgDelPromises)
}

export const imageDeleteOriginalService = async (id: ImagePrisma['id']) => {
  // get info before update
  const image = await prisma.image.findUnique({
    where: { id }
  })
  if (image == null) {
    throw new AppError('imageId不存在')
  }
  // first update database
  const updatedImage = await prisma.image.update({
    where: { id },
    data: {
      originalSize: 0,
      originalPath: null
    }
  }).catch(() => {
    throw new AppError('图片修改失败')
  })
  // delete file
  imageSystem.deleteOriginalImage(image.originalPath)
  return updatedImage
}

export const imageDeleteAllOriginalService = async () => {
  // update database
  const imgOriginalDelCount = await prisma.image.updateMany({
    where: {
      originalSize: { not: 0 }
    },
    data: {
      originalSize: 0,
      originalPath: null
    }
  }).catch(() => {
    throw new AppError('数据库更新失败')
  })
  // del file
  await imageSystem.deleteAllOriginalImage()
  return imgOriginalDelCount.count
}

const imageIncludeOnGet = {
  _count: {
    select: { posts: true }
  },
  posts: {
    include: {
      _count: {
        select: {
          images: true,
          replies: true
        }
      }
    }
  }
}

export const imageGetByIdService = async (id: ImagePrisma['id']) => {
  const image = await prisma.image.findUnique({
    where: { id },
    include: { ...imageIncludeOnGet }
  })
  if (image == null) {
    throw new AppError('图片不存在', 400)
  }
  return image
}

export const imageGetByCursorService = async (
  cursorId: ImagePrisma['id'], query: ImageGetByCursorQueryType
) => {
  // when cursorId is 0, it's first,
  // skip must be undefined, and cursor is undefined
  const skip = cursorId === '' ? undefined : 1
  const cursor = cursorId === '' ? undefined : { id: cursorId }

  let posts
  if (query.havePost === 'true') {
    posts = { some: {} }
  } else if (query.havePost === 'false') {
    posts = { none: {} }
  } else { // 'all' | undefined
    posts = undefined
  }

  let originalSize
  if (query.haveOriginal === 'true') {
    originalSize = { not: 0 }
  } else if (query.haveOriginal === 'false') {
    originalSize = { equals: 0 }
  } else { // 'all' | undefined
    originalSize = undefined
  }

  const images = await prisma.image.findMany({
    take: postConfig.imageNumInPage,
    skip,
    cursor,
    where: {
      posts,
      originalSize
    },
    orderBy: { addedAt: 'desc' },
    include: { ...imageIncludeOnGet }
  })
  return images
}
