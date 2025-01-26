import { type DQWPostData, type DQWImageData } from '@/types'

// 数据整理，处理查询数据

// 帖子的基本数据整理
const dataDQWPostDataHandle = (data: DQWPostData) => {
  // 整理images
  const images = data.postsToImages.map((pTIitem) => {
    return pTIitem.image
  })
  const _count = {
    // 计数replies
    replies: data.replies.length
  }
  return {
    ...data,
    images,
    _count,
    postsToImages: undefined,
    replies: undefined
  }
}
// 为了方便管理，dataDQWPostDataHandle不导出，以这个代替
export const dataDQWPostBaseHandle = (data: DQWPostData) => {
  return dataDQWPostDataHandle(data)
}

// 创建帖子后的图片查询数据处理
export const dataDQWPostSendHandle = (data: DQWPostData) => {
  return dataDQWPostDataHandle(data)
}

// 图片的数据整理
const dataDQWImageDataHandle = (data: DQWImageData) => {
  // 整理posts
  const posts = data.postsToImages.map((pTIitem) => {
    const _count = {
      // 计数 images
      images: pTIitem.post.postsToImages.length,
      // 计数 replies
      replies: pTIitem.post.replies.length
    }
    return {
      ...pTIitem.post,
      _count,
      postsToImages: undefined,
      replies: undefined
    }
  })
  const _count = {
    // 计数 posts
    posts: posts.length
  }
  return {
    ...data,
    posts,
    _count,
    postsToImages: undefined
  }
}
export const dataDQWImageBaseHandle = (data: DQWImageData) => {
  return dataDQWImageDataHandle(data)
}

// src\utils\data\db-query-with.ts
// 在 src\services\image.ts 被调用
// 通过id查询图片
export const dataDQWImageGetByIdHandle = (data: DQWImageData) => {
  return dataDQWImageDataHandle(data)
}

// src\utils\data\db-query-with.ts
// 在 src\services\image.ts 被调用
// 通过游标分页查询图片
export const dataDQWImageGetByCursorHandle = (dataList: DQWImageData[]) => {
  return dataList.map(data => dataDQWImageDataHandle(data))
}
