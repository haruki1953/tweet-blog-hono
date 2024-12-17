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
    throw new AppError('帖子删除失败')
  })
  return data
}

// 多余的导入记录删除
export const postControlDeleteImportExcessService = async () => {
  // 1. 获取每个帖子和link组合的最新importedAt
  const latestImports = await prisma.postImport.groupBy({
    by: ['postId', 'link'],
    _max: {
      importedAt: true
    }
  })

  // 构建删除条件
  const deleteConditions = []
  for (const item of latestImports) {
    if (item._max.importedAt == null) {
      continue
    }
    deleteConditions.push({
      postId: item.postId,
      link: item.link,
      NOT: {
        importedAt: item._max.importedAt
      }
    })
  }

  // 2. 删除不是最新的PostImport记录
  const { count } = await prisma.postImport.deleteMany({
    where: { OR: deleteConditions }
  })

  return { count }
}
