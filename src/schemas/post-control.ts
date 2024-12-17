import { platformKeyEnum } from '@/configs'
import { z } from 'zod'
import { idParamSchema, type IdParamType } from './base'
// import { type IdParamType, idParamSchema } from './base'

export const postControlImportJsonSchema = z.object({
  importPosts: z.array(z.object({
    content: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    importImages: z.array(z.object({
      link: z.string(),
      alt: z.string().optional(),
      platform: z.enum(platformKeyEnum).optional(),
      platformId: z.string().optional()
    })),
    // .max(postConfig.postMaxImages)
    platform: z.enum(platformKeyEnum).optional(),
    platformId: z.string().optional(),
    platformLink: z.string().optional(),
    platformParentId: z.string().nullable().optional(),
    isDeleted: z.boolean().optional()
  }))
})
export type PostControlImportJsonType = z.infer<typeof postControlImportJsonSchema>

export const postControlDeleteImportDataParamSchema = idParamSchema
export type PostControlDeleteImportDataParamType = IdParamType
