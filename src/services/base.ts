import { AppError } from '@/classes'
import { prisma, useAdminSystem, useImageSystem } from '@/systems'
import { sign } from 'hono/jwt'

const adminSystem = useAdminSystem()
const imageSystem = useImageSystem()

export const generateTokenAdmin = async (
  payloadStr: string
) => {
  const payload = {
    payloadStr,
    exp: Math.floor(Date.now() / 1000) + adminSystem.getJwtAdminExpSeconds()
  }
  const token = await sign(payload, adminSystem.getJwtAdminSecretKey())
  return token
}

export const deleteImageByIdWhereNonePost = async (id: number) => {
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
