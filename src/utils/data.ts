import { systemFileConfig } from '@/configs'
import { type Image, type Post } from '@/types'
import { z } from 'zod'

// 将数据库里的 image.path 拼接为本地大图路径
const dataImageJoinLocalLargeImagePath = (
  // path: string
  path: Image['path']
) => {
  return systemFileConfig.largeImageSavePath + path
}

// 将数据库里的 image.path 拼接为本地小图路径
const dataImageJoinLocalSmallImagePath = (
  // path: string
  path: Image['path']
) => {
  return systemFileConfig.smallImageSavePath + path
}

// 将数据库里的 image.path 拼接为本地原图路径
const dataImageJoinLocalOriginalImagePath = (
  // path: string
  path: Image['path']
) => {
  return systemFileConfig.originalImageSavePath + path
}

// 得到 image 最好的本地图片路径，原图 > 大图 > 小图
export const dataImageBestLocalImagePath = (
  // path: string
  image: Image
) => {
  if (image.originalSize > 0 && image.originalPath != null) {
    return dataImageJoinLocalOriginalImagePath(image.originalPath)
  }
  if (image.largeSize > 0) {
    return dataImageJoinLocalLargeImagePath(image.path)
  }
  return dataImageJoinLocalSmallImagePath(image.path)
}

// 利用 Post.imagesOrder 对 Post.images 排序
export const dataPostHandleImagesOrder = <T extends Post>(post: T): T => {
  let newImages: Image[] = []
  try {
    if (post.imagesOrder == null) {
      throw new Error()
    }
    const imagesOrderIdList = z.array(z.string()).parse(
      JSON.parse(post.imagesOrder)
    )
    const imagesOrderList = imagesOrderIdList
      .map((imgId) => {
        return post.images.find((img) => img.id === imgId)
      })
      .filter((img): img is Image => img !== undefined)
    newImages = imagesOrderList
  } catch (error) {
    newImages = post.images
  }
  return {
    ...post,
    images: newImages
  }
}
