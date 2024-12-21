import { platformKeyMap } from '@/configs'
import { z } from 'zod'

// forwardSystem 转发系统中数据保存的类型
// 定义转发配置基础
export const forwardSettingBaseSchema = z.object({
  uuid: z.string(),
  name: z.string()
})

// 定义 forwardConfigX 即为X/Twitter
export const forwardSettingXSchema = forwardSettingBaseSchema.extend({
  platform: z.literal(platformKeyMap.X.key),
  data: platformKeyMap.X.forwardSettingDataSchema
})
// 定义 forwardConfigT 用于测试
export const forwardSettingTSchema = forwardSettingBaseSchema.extend({
  platform: z.literal(platformKeyMap.T.key),
  data: platformKeyMap.T.forwardSettingDataSchema
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

// 注意：修改完上面之后，这里也要修改
// ForSetSchema 将被用于转发配置设置接口，data改为可选
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
