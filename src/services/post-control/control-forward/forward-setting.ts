import { type PostControlForwardSettingSetJsonType } from '@/schemas'
import { prisma, useForwardSystem } from '@/systems'

const forwardSystem = useForwardSystem()

export const postControlForwardGetService = () => {
  const forwardStore = forwardSystem.forwardStore()
  return {
    forwardStore
  }
}

export const postControlForwardSettingSetService = (json: PostControlForwardSettingSetJsonType) => {
  const { forwardSettingList } = json
  forwardSystem.forwardSettingSet(forwardSettingList)
  return postControlForwardGetService()
}

// 转发帖子统计
export const postControlForwardSettingPostCountService = async () => {
  // 帖子总数
  const totalPostCount = await prisma.post.count({
    where: {
      // 回收站中的帖子不计数
      isDeleted: false
    }
  })
  // 遍历转发配置，统计转发的贴子数
  const { forwardSettingList } = forwardSystem.forwardStore()
  const forwardSettingPostList = await Promise.all(
    forwardSettingList.map(async (forwardSettingItem) => {
      const uuid = forwardSettingItem.uuid
      const count = await prisma.post.count({
        where: {
          isDeleted: false,
          // 帖子转发记录中存在转发配置的uuid，即代表被转发
          postForwards: {
            some: {
              forwardConfigId: uuid
            }
          }
        }
      })
      return {
        uuid,
        count
      }
    })
  )
  return {
    totalPostCount,
    forwardSettingPostList
  }
}
