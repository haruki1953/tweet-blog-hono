import { AppError } from '@/classes'
import { type ImageGetByCursorQueryType, type ImageUpdateConfigJsonType, type ImageUpdateJsonType } from '@/schemas'
import { useFetchSystem, useImageSystem } from '@/systems'
import { baseFindImageById, deleteImageByIdWhereNonePost } from './base'
import { postConfig } from '@/configs'
import { type ImageInferSelect } from '@/types'
import { useLogUtil } from '@/utils'
import { drizzleDb, drizzleOrm, drizzleSchema } from '@/db'

const imageSystem = useImageSystem()
const fetchSystem = useFetchSystem()
const logUtil = useLogUtil()

// src\services\image.ts
// 图片添加接口
export const imageSendService = async (
  imageFile: File | Blob,
  imageInfo?: Omit<ImageUpdateJsonType, 'id'>
) => {
  // 处理图片
  const {
    path,
    originalPath,
    smallSize,
    largeSize,
    originalSize
  } = await imageSystem.processImage(imageFile).catch((error) => {
    logUtil.info({
      title: '图片添加失败 | 图片处理失败',
      content: String(error)
    })
    throw new AppError('图片处理失败')
  })

  const newDate = new Date()

  // 数据库添加图片
  const addedImage = await drizzleDb
    .insert(drizzleSchema.images)
    .values({
      path,
      originalPath,
      smallSize,
      largeSize,
      originalSize,
      alt: imageInfo?.alt,
      // 时间之类最后手动指定，因为默认值只以秒为精确度
      createdAt: imageInfo?.createdAt ?? newDate,
      addedAt: newDate,
      updatedAt: newDate
    })
    .returning()
    .catch((error) => {
      logUtil.info({
        title: '图片添加失败 | 数据库记录失败',
        content: String(error)
      })
      throw new AppError('数据库记录失败')
    })
  return addedImage
}

export const imageSendByUrlService = async (
  imageUrl: string
) => {
  const imageBlob = await fetchSystem.baseBlobApi(imageUrl) as Blob
  return await imageSendService(imageBlob)
}

// src\services\image.ts
// 更新
export const imageUpdateService = async (
  imageInfo: ImageUpdateJsonType
) => {
  // 查找图片
  const targetImage = await baseFindImageById(imageInfo.id)
  if (targetImage == null) {
    throw new AppError('图片不存在')
  }
  // 修改信息
  const updatedImage = await drizzleDb.update(drizzleSchema.images)
    .set({
      alt: imageInfo.alt,
      createdAt: imageInfo.createdAt
    })
    .where(drizzleOrm.eq(drizzleSchema.images.id, targetImage.id))
    .returning()
    .catch((error) => {
      if (error.code === 'P2025') {
        throw new AppError('imageId不存在')
      }
      logUtil.info({
        title: '图片修改失败',
        content: `image id: ${imageInfo.id}\n` + String(error)
      })
      throw new AppError('图片修改失败')
    })
  return updatedImage
}

export const imageGetConfigService = () => {
  return imageSystem.getImageConfig()
}

export const imageUpdateConfigService = (
  configInfo: ImageUpdateConfigJsonType
) => {
  imageSystem.updateImageConfig(configInfo)
}

export const imageDeleteService = async (id: ImageInferSelect['id']) => {
  await deleteImageByIdWhereNonePost(id)
}

// src\services\image.ts
// 查询关系
export const imageDeleteAllService = async () => {
  // drizzle好像不支持直接查询“没有帖子的图片”，需要自己过滤
  const images = (await drizzleDb.query.images.findMany({
    with: {
      postsToImages: true
    }
  })).filter(i => i.postsToImages.length === 0)

  const imgDelPromises = images.map(async (img) => {
    return await deleteImageByIdWhereNonePost(img.id).catch(() => null)
  })

  return await Promise.all(imgDelPromises)
}

// src\services\image.ts
// 删除原图
export const imageDeleteOriginalService = async (id: ImageInferSelect['id']) => {
  // get info before update
  // 在更新前查询图片
  const image = await baseFindImageById(id)
  if (image == null) {
    throw new AppError('imageId不存在')
  }
  // first update database
  // 首先更新数据库
  const updatedImage = await drizzleDb.update(drizzleSchema.images)
    .set({
      originalSize: 0,
      originalPath: null
    })
    .where(drizzleOrm.eq(drizzleSchema.images.id, image.id))
    .returning()
    .catch((error) => {
      logUtil.info({
        title: '删除原图 | 图片修改失败',
        content: `image id: ${id}\n` + String(error)
      })
      throw new AppError('图片修改失败')
    })
  // delete file
  // 然后再在文件中删除
  imageSystem.deleteOriginalImage(image.originalPath)
  return updatedImage
}

// src\services\image.ts
// 删除全部原图
export const imageDeleteAllOriginalService = async () => {
  // update database
  // 更新数据库
  const imgOriginalDelList = await drizzleDb.update(drizzleSchema.images)
    .set({
      originalSize: 0,
      originalPath: null
    })
    .where(drizzleOrm.not(
      drizzleOrm.eq(drizzleSchema.images.originalSize, 0)
    ))
    .returning()
    .catch((error) => {
      logUtil.info({
        title: '删除全部原图 | 数据库更新失败',
        content: String(error)
      })
      throw new AppError('数据库更新失败')
    })
  // del file
  // 删除文件
  await imageSystem.deleteAllOriginalImage().catch((error) => {
    logUtil.info({
      title: '删除全部原图 | 图片删除失败',
      content: String(error)
    })
    throw new AppError('图片删除失败')
  })
  return imgOriginalDelList.length
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

// src\services\image.ts
// 通过id查询图片
export const imageGetByIdService = async (id: ImageInferSelect['id']) => {
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
  cursorId: ImageInferSelect['id'], query: ImageGetByCursorQueryType
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
