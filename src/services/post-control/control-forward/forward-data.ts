import { AppError } from '@/classes'
import { type PostControlForwardManualLinkingImageJsonType, type PostControlForwardManualLinkingJsonType } from '@/schemas'
import { prisma, useForwardSystem } from '@/systems'

import { useLogUtil } from '@/utils'

const forwardSystem = useForwardSystem()

const logUtil = useLogUtil()

export const postControlDeleteForwardDataService = async (id: string) => {
  const data = await prisma.postForward.delete({
    where: { id }
  }).catch((error) => {
    if (error.code === 'P2025') {
      throw new AppError('转发记录不存在', 400)
    }
    logUtil.info({
      title: '转发记录删除失败',
      content: `postForward id: ${id}\n${String(error)}`
    })
    throw new AppError('转发记录删除失败')
  })
  return data
}

// 关联帖子
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

  // 如果平台中的帖子id已存在，则无需再关联
  let postForward = await prisma.postForward.findFirst({
    where: {
      postId,
      forwardConfigId,
      platformPostId
    }
  })
  // 存在则更新，否则创建
  if (postForward != null) {
    postForward = await prisma.postForward.update({
      where: {
        id: postForward.id
      },
      data: {
        link: platformPostLink,
        forwardAt,
        platform: findForwardSetting.platform
      }
    })
  } else {
    postForward = await prisma.postForward.create({
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
      logUtil.info({
        title: '转发记录创建失败',
        content: `postId: ${
          postId
        }\nforwardConfigId: ${
          forwardConfigId
        }\n${String(error)}`
      })
      throw new AppError('转发记录创建失败')
    })
  }

  return postForward
}

// 关联图片
export const postControlForwardManualLinkingImageService = async (
  json: PostControlForwardManualLinkingImageJsonType
) => {
  const {
    imageId,
    forwardConfigId,
    platformImageId,
    platformImageLink,
    forwardAt
  } = json

  const findForwardSetting = forwardSystem.forwardSettingFind(forwardConfigId)
  if (findForwardSetting == null) {
    throw new AppError('转发配置不存在', 400)
  }

  // 如果平台中的图片id已存在，则无需再关联
  let imageForward = await prisma.imageForward.findFirst({
    where: {
      imageId,
      forwardConfigId,
      platformImageId
    }
  })
  if (imageForward != null) {
    imageForward = await prisma.imageForward.update({
      where: {
        id: imageForward.id
      },
      data: {
        link: platformImageLink,
        forwardAt,
        platform: findForwardSetting.platform
      }
    })
  } else {
    imageForward = await prisma.imageForward.create({
      data: {
        imageId,
        forwardConfigId,
        platformImageId,
        link: platformImageLink,
        forwardAt,
        platform: findForwardSetting.platform
      }
    }).catch((error) => {
      if (error.code === 'P2025') {
        throw new AppError('图片不存在', 400)
      }
      logUtil.info({
        title: '转发记录创建失败',
        content: `imageId: ${
          imageId
        }\nforwardConfigId: ${
          forwardConfigId
        }\n${String(error)}`
      })
      throw new AppError('转发记录创建失败')
    })
  }

  return imageForward
}

// 删除无对应转发配置的记录
export const postControlDeleteForwardNotSettingService = async () => {
  // 获取现在的转发记录
  const forwardSettingIdList = forwardSystem.forwardSettingGet().map(i => i.uuid)

  // 删除 forwardConfigId 不在 forwardSettingIdList 中的转发记录
  const postForward = await prisma.postForward.deleteMany({
    where: {
      forwardConfigId: {
        notIn: forwardSettingIdList
      }
    }
  })
  const imageForward = await prisma.imageForward.deleteMany({
    where: {
      forwardConfigId: {
        notIn: forwardSettingIdList
      }
    }
  })
  return {
    postForward,
    imageForward
  }
}

// 全部推文转发记录删除
export const postControlDeleteForwardAllPostService = async () => {
  const postForward = await prisma.postForward.deleteMany()
  return {
    postForward,
    imageForward: {
      count: 0
    }
  }
}

// 全部图片转发记录删除
export const postControlDeleteForwardAllImageService = async () => {
  const imageForward = await prisma.imageForward.deleteMany()
  return {
    postForward: {
      count: 0
    },
    imageForward
  }
}
