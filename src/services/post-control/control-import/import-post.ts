import { type PostControlImportJsonType } from '@/schemas'
import { prisma } from '@/systems'
import { imageSendByUrlService, imageUpdateService, postSendService, postUpdateService } from './dependencies'
import { type ImagePrisma } from '@/types'
import { useTaskSystem } from '@/systems/task'
import { useLogUtil } from '@/utils'
import { platformKeyMap } from '@/configs'

const taskSystem = useTaskSystem()

const logUtil = useLogUtil()

// 帖子导入服务
export const postControlImportService = async (json: PostControlImportJsonType) => {
  const { importPosts } = json
  // 创建任务，用于保存导入进度
  const taskImport = taskSystem.taskImportCreate({
    totalCount: importPosts.length
  })
  ;(async () => {
    logUtil.info({
      content: `${importPosts.length} 条推文开始导入，任务 uuid: ${taskImport.uuid}`
    })
    // 已完成计数
    let completedCount = 0
    // 遍历，导入帖子。
    for (const post of importPosts) {
      if (!taskSystem.taskIsRunning(taskImport.uuid)) {
        // 如果任务非运行状态，则导入中止
        logUtil.info({
          content: `${importPosts.length} 条推文导入中止，任务 uuid: ${taskImport.uuid}`
        })
        return
      }
      await postControlImportServicePostImportPart(post).catch((error) => {
        const content = (() => {
          if (post.platform == null || post.platformLink == null) {
            return String(error)
          }
          return `${
            platformKeyMap[post.platform].name +
            ' : ' +
            post.platformLink +
            '\n' +
            String(error)
          }`
        })()
        logUtil.warning({
          title: '帖子导入发生错误',
          content
        })
        return null
      })
      completedCount += 1
      // 更新任务信息
      taskSystem.taskImportUpdate(taskImport.uuid, {
        completedCount
      })
    }
    logUtil.success({
      content: `${importPosts.length} 条推文完成导入，任务 uuid: ${taskImport.uuid}`
    })
    // 任务完成
    // taskSystem.taskImportDelete(taskImport.uuid)
    taskSystem.taskComplete(taskImport.uuid)
  })().catch(() => {})
  return {
    taskImport,
    taskStore: taskSystem.taskStore()
  }
}

// 帖子导入服务：帖子导入部分
const postControlImportServicePostImportPart = async (
  post: PostControlImportJsonType['importPosts'][number]
) => {
  const { importImages } = post
  // 遍历，导入图片
  const targetImages = (await Promise.all(
    importImages.map(async (image) => {
      return await postControlImportServiceImageImportPart(image).catch((error) => {
        const content = (() => {
          if (image.platform == null || image.link == null) {
            return String(error)
          }
          return `${
            platformKeyMap[image.platform].name +
            ' : ' +
            image.link +
            '\n' +
            String(error)
          }`
        })()
        logUtil.warning({
          title: '图片导入发生错误',
          content
        })
        // return null
        // 【250102】图片错误处理逻辑改变，之前是忽略错误图片，现在改为抛出错误
        throw error
      })
    })
  ))
  // .filter((i): i is ImagePrisma => i != null)

  const {
    content,
    createdAt,
    platform,
    platformId,
    platformLink,
    platformParentId,
    isDeleted
  } = post

  let targetPost
  if (platform != null && platformId != null && platformLink != null) {
    // 包含platform与platformId，是从平台导入

    // 查询是否存在父贴
    const parentPost = await (async () => {
      if (platformParentId == null) {
        return undefined
      }
      return await prisma.post.findFirst({
        where: {
          OR: [
            {
              postImports: {
                some: {
                  platform,
                  platformPostId: platformParentId
                }
              }
            },
            {
              postForwards: {
                some: {
                  platform,
                  platformPostId: platformParentId
                }
              }
            }
          ]
        }
      })
    })()

    // 在 PostImport 中查询，是否已经被导入
    targetPost = await prisma.post.findFirst({
      where: {
        OR: [
          {
            postImports: {
              some: {
                platform,
                platformPostId: platformId
              }
            }
          },
          {
            postForwards: {
              some: {
                platform,
                platformPostId: platformId
              }
            }
          }
        ]
      }
    })
    if (targetPost == null) {
      // 帖子未被导入或转发，创建帖子
      targetPost = await postSendService({
        content,
        createdAt,
        isDeleted,
        images: targetImages.map(i => i.id),
        parentPostId: parentPost?.id
      })
    } else {
      // 帖子已被导入或转发，更新帖子
      targetPost = await postUpdateService({
        id: targetPost.id,
        content,
        createdAt,
        isDeleted,
        images: targetImages.map(i => i.id),
        parentPostId: parentPost?.id
      })
    }
    // 添加导入信息
    await prisma.post.update({
      where: {
        id: targetPost.id
      },
      data: {
        postImports: {
          create: {
            platform,
            platformPostId: platformId,
            link: platformLink
          }
        }
      }
    })
  } else {
    // 不包含platform与platformId，是自定义导入
    targetPost = await postSendService({
      content, createdAt, isDeleted, images: targetImages.map(i => i.id)
    })
  }
  return targetPost
}

// 帖子导入服务：图片导入部分
const postControlImportServiceImageImportPart = async (
  image: PostControlImportJsonType['importPosts'][number]['importImages'][number]
): Promise<ImagePrisma> => {
  const { platform, platformId, link, alt } = image
  let targetImage
  if (platform != null && platformId != null) {
    // 包含platform与platformId，是从平台导入
    // 在 imageImport imageForwards 中查询，是否已经被导入或转发
    targetImage = await prisma.image.findFirst({
      where: {
        // imageImports: {
        //   some: {
        //     platform,
        //     platformImageId: platformId
        //   }
        // }
        OR: [
          {
            imageImports: {
              some: {
                platform,
                platformImageId: platformId
              }
            }
          },
          {
            imageForwards: {
              some: {
                platform,
                platformImageId: platformId
              }
            }
          }
        ]
      }
    })
    if (targetImage == null) {
      // 图片未被导入，处理图片
      targetImage = await imageSendByUrlService(link)
    }
    // 数据库更新Image（主要是alt, imageImport）
    targetImage = await prisma.image.update({
      where: {
        id: targetImage.id
      },
      data: {
        alt,
        imageImports: {
          create: {
            platform,
            platformImageId: platformId,
            link
          }
        }
      }
    })
  } else {
    // 不包含platform与platformId，是自定义导入，则不用记录导入信息
    targetImage = await imageSendByUrlService(link)
    targetImage = await imageUpdateService({ id: targetImage.id, alt })
  }
  return targetImage
}
