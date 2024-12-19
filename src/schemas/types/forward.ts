import { platformKeyMap } from '@/configs'
import { z } from 'zod'

// forwardSystem 转发系统
// 定义转发配置基础
export const forwardSettingBaseSchema = z.object({
  uuid: z.string(),
  name: z.string()
})
// 定义 forwardConfigX 即为X/Twitter
export const forwardSettingXSchema = forwardSettingBaseSchema.extend({
  platform: z.literal(platformKeyMap.X.key),
  data: z.object({
    token1: z.string()
  })
})
// 定义 forwardConfigT 用于测试
export const forwardSettingTSchema = forwardSettingBaseSchema.extend({
  platform: z.literal(platformKeyMap.T.key),
  data: z.object({
    token2: z.string()
  })
})
// 合并后forwardSettingList的项
export const forwardSettingItemSchema = z.union([
  forwardSettingXSchema,
  forwardSettingTSchema
])
// export const forwardSettingItemSchema = forwardSettingXSchema

export const forwardSettingListSchema = z.array(forwardSettingItemSchema)
// ForwardStore
export const typesForwardStoreSchema = z.object({
  forwardSettingList: forwardSettingListSchema
})

// 将被用于设置接口，data可选
export const forwardSettingXForSetSchema = forwardSettingXSchema.extend({
  data: forwardSettingXSchema.shape.data.optional()
})
export const forwardSettingTForSetSchema = forwardSettingTSchema.extend({
  data: forwardSettingTSchema.shape.data.optional()
})

export const forwardSettingItemForSetSchema = z.union([
  forwardSettingXForSetSchema,
  forwardSettingTForSetSchema
])
// export const forwardSettingItemForSetSchema = forwardSettingXForSetSchema
export const forwardSettingListForSetSchema = z.array(forwardSettingItemForSetSchema)
