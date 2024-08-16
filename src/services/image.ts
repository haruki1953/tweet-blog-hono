import { AppError } from '@/classes'
import { type ImageUpdateConfigJsonType, type ImageUpdateJsonType } from '@/schemas'
import { prisma, useImageSystem } from '@/systems'
import { Prisma } from '@prisma/client'

const imageSystem = useImageSystem()

export const imageSendService = async (
  imageFile: File
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

export const imageUpdateService = async (
  imageInfo: ImageUpdateJsonType
) => {
  const image = await prisma.image.update({
    where: {
      id: imageInfo.id
    },
    data: {
      alt: imageInfo.alt,
      twitterLargeImageLink: imageInfo.twitterLargeImageLink
    }
  }).catch((error) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AppError('imageId不存在')
      }
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
