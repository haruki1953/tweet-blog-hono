import { type PostControlImportJsonType } from '@/schemas/post-control'
import { prisma } from '@/systems'
import { imageSendByUrlService, imageUpdateService, postSendService, postUpdateService } from './dependencies'
import { type ImagePrisma } from '@/types'

// 帖子导入服务
export const postControlImportService = async (json: PostControlImportJsonType) => {
  const { importPosts } = json
  // 遍历，导入帖子
  for (const post of importPosts) {
    const postinfo = await postControlImportServicePostImportPart(post).catch(() => null)
    console.log(postinfo)
  }
  console.log('导入完毕')
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
        console.log(error)
        return null
      })
    })
  )).filter((i): i is ImagePrisma => i != null)

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
    // 在 imageImport 中查询，是否已经被导入
    targetImage = await prisma.image.findFirst({
      where: {
        imageImports: {
          some: {
            platform,
            platformImageId: platformId
          }
        }
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
    // 不包含platform与platformId，是自定义导入
    targetImage = await imageSendByUrlService(link)
    targetImage = await imageUpdateService({ id: targetImage.id, alt })
  }
  return targetImage
}
