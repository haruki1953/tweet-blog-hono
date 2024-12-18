import { platformKeyMap } from '@/configs'
import { z } from 'zod'

export const typesAdminStoreSchema = z.object({
  username: z.string(),
  password: z.string(),
  jwtAdminSecretKey: z.string(),
  jwtAdminExpSeconds: z.number().int().positive(),
  loginMaxFailCount: z.number().int().positive(),
  loginLockSeconds: z.number().int().positive(),
  proxyAddressHttp: z.string()
})

export const typesFileStoreSchema = z.object({
  imageLargeMaxLength: z.number().int().positive(),
  imageSmallMaxLength: z.number().int().positive(),
  imageQuality: z.number().int().min(1).max(100)
})

export const typesProfileStoreSchema = z.object({
  avatar: z.string().nullable(),
  avatarArray: z.array(z.object({
    uuid: z.string(),
    path: z.string(),
    size: z.number(),
    addAt: z.coerce.date()
  })),
  name: z.string(),
  bio: z.string(),
  socialMedias: z.array(z.object({
    uuid: z.string(),
    name: z.string(),
    description: z.string(),
    link: z.string(),
    fontawesomeClass: z.string()
  })),
  aboutMarkdown: z.string(),
  externalLinks: z.array(z.object({
    uuid: z.string(),
    name: z.string(),
    description: z.string(),
    link: z.string(),
    icon: z.string(),
    isCircle: z.boolean(),
    type: z.enum(['contact', 'friend'])
  })),
  externalIcons: z.array(z.object({
    uuid: z.string(),
    path: z.string(),
    size: z.number(),
    addAt: z.coerce.date()
  }))
})

// 定义转发配置基础
export const forwardSettingBaseSchema = z.object({
  uuid: z.string(),
  name: z.string()
})
// 定义 ForwardConfigX
export const forwardSettingXSchema = forwardSettingBaseSchema.extend({
  platform: z.literal(platformKeyMap.X.key),
  data: z.object({
    token1: z.string()
  })
})
// 将被用于设置接口，data可选
export const forwardSettingXForSetSchema = forwardSettingXSchema.extend({
  data: forwardSettingXSchema.shape.data.optional()
})

export const forwardSettingTSchema = forwardSettingBaseSchema.extend({
  platform: z.literal(platformKeyMap.T.key),
  data: z.object({
    token2: z.string()
  })
})
export const forwardSettingTForSetSchema = forwardSettingTSchema.extend({
  data: forwardSettingTSchema.shape.data.optional()
})

// 合并后forwardSettingList的项
export const forwardSettingItemSchema = z.union([
  forwardSettingXSchema,
  forwardSettingTSchema
])
// export const forwardSettingItemSchema = forwardSettingXSchema
export const forwardSettingItemForSetSchema = z.union([
  forwardSettingXForSetSchema,
  forwardSettingTForSetSchema
])
// export const forwardSettingItemForSetSchema = forwardSettingXForSetSchema
// ForwardStore
export const typesForwardStoreSchema = z.object({
  forwardSettingList: z.array(forwardSettingItemSchema)
})
