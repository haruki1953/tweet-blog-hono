import { AppError } from '@/classes'
import { prisma, useImageSystem } from '@/systems'
import { type ImagePrisma } from '@/types'

const imageSystem = useImageSystem()

export const deleteImageByIdWhereNonePost = async (id: ImagePrisma['id']) => {
  // in table, delete image
  const img = await prisma.image.delete({
    where: { id, posts: { none: {} } }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('图片被引用中，或图片id不存在', 400)
    }
    throw new AppError('图片删除失败')
  })
  // in file, delete image
  imageSystem.deleteImage(img.path, img.originalPath)
  return img
}
