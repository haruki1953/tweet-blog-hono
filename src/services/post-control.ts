import { platformLabelMap } from '@/configs'
import { type PostControlImportJsonType } from '@/schemas/post-control'
import { prisma } from '@/systems'

export const postControlImportService = async (json: PostControlImportJsonType) => {
  const { importPosts } = json
  for (const post of importPosts) {
    // // 检查是否已有相同平台同id的帖子
    // // postImports与postForwards都要找
    // const { platform, platformId } = post
    // // 检查 postImports
    // const existingImport = await prisma.postImport.findFirst({
    //   where: {
    //     platform,
    //     platformPostId: platformId
    //   }
    // })

    // // 检查 postForwards
    // const existingForward = await prisma.postForward.findFirst({
    //   where: {
    //     platform,
    //     platformPostId: platformId
    //   }
    // })
  }
}
