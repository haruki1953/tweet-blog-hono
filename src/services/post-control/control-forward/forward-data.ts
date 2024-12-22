import { AppError } from '@/classes'
import { type PostControlForwardManualLinkingJsonType } from '@/schemas/post-control'
import { prisma } from '@/systems'
import { useForwardSystem } from '@/systems/forward'

const forwardSystem = useForwardSystem()

export const postControlDeleteForwardDataService = async (id: string) => {
  const data = await prisma.postForward.delete({
    where: { id }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('转发记录不存在', 400)
    }
    console.log(error)
    throw new AppError('转发记录删除失败')
  })
  return data
}

export const postControlForwardManualLinkingService = async (
  json: PostControlForwardManualLinkingJsonType
) => {
  const {
    postId,
    forwardConfigId,
    platformPostId,
    platformPostLink,
    forwardAt
  } = json

  const findForwardSetting = forwardSystem.forwardSettingFind(forwardConfigId)
  if (findForwardSetting == null) {
    throw new AppError('转发配置不存在', 400)
  }

  const postForward = await prisma.postForward.create({
    data: {
      postId,
      forwardConfigId,
      platformPostId,
      link: platformPostLink,
      forwardAt,
      platform: findForwardSetting.platform
    }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('帖子不存在', 400)
    }
    throw new AppError('转发记录创建失败')
  })

  return postForward
}
