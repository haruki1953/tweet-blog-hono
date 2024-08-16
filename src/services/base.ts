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

export const deleteImageById = async (id: number) => {
  // in table, delete image
  const img = await prisma.image.delete({
    where: { id }
  }).catch(() => {
    throw new AppError('图片删除失败')
  })
  // in file, delete image
  imageSystem.deleteImage(img.path, img.originalPath)
  return img
}

export const deleteImageByIdOnNoPost = async (id: number) => {
  const img = await prisma.image.findUnique({
    where: { id },
    include: {
      _count: { select: { posts: true } }
    }
  })
  if (img == null) {
    throw new AppError('图片不存在')
  }
  if (img._count.posts === 0) {
    return await deleteImageById(id)
  } else {
    return null
  }
}
