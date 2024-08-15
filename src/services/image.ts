import { prisma, useImageSystem } from '@/systems'

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
