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
