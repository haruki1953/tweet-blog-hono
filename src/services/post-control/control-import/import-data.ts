import { AppError } from '@/classes'
import { prisma } from '@/systems'

export const postControlDeleteImportDataService = async (id: string) => {
  const data = await prisma.postImport.delete({
    where: { id }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('导入记录不存在', 400)
    }
    console.log(error)
    throw new AppError('导入记录删除失败')
  })
  return data
}

// 多余的导入记录删除
export const postControlDeleteImportExcessService = async () => {
  // 1. 获取每个帖子id和导入平台帖子id组合的最新importedAt
  const latestPostImports = await prisma.postImport.groupBy({
    by: ['postId', 'platformPostId'],
    _max: {
      importedAt: true
    }
  })
  // 图片的导入记录也要查找并删除
  const latestImageImports = await prisma.imageImport.groupBy({
    by: ['imageId', 'platformImageId'],
    _max: {
      importedAt: true
    }
  })

  // 构建删除条件
  const deleteConditionsPostImports = []
  for (const item of latestPostImports) {
    if (item._max.importedAt == null) {
      continue
    }
    deleteConditionsPostImports.push({
      postId: item.postId,
      platformPostId: item.platformPostId,
      NOT: {
        importedAt: item._max.importedAt
      }
    })
  }
  const deleteConditionsImageImports = []
  for (const item of latestImageImports) {
    if (item._max.importedAt == null) {
      continue
    }
    deleteConditionsImageImports.push({
      imageId: item.imageId,
      platformImageId: item.platformImageId,
      NOT: {
        importedAt: item._max.importedAt
      }
    })
  }

  // 2. 删除不是最新的导入记录
  const postImport = await prisma.postImport.deleteMany({
    where: { OR: deleteConditionsPostImports }
  })
  const imageImport = await prisma.imageImport.deleteMany({
    where: { OR: deleteConditionsImageImports }
  })

  return {
    postImport,
    imageImport
  }
}

export const postControlDeleteImportAllPostService = async () => {
  const postImport = await prisma.postImport.deleteMany()
  return {
    postImport,
    imageImport: {
      count: 0
    }
  }
}

export const postControlDeleteImportAllImageService = async () => {
  const imageImport = await prisma.imageImport.deleteMany()
  return {
    postImport: {
      count: 0
    },
    imageImport
  }
}
