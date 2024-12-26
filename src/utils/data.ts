import { systemFileConfig } from '@/configs'
import { type Image, type Post } from '@/types'
import { z } from 'zod'

// 将数据库里的 image.path 拼接为本地大图路径
export const dataImageJoinLocalLargeImagePath = (
  // path: string
  path: Image['path']
) => {
  return systemFileConfig.largeImageSavePath + path
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
