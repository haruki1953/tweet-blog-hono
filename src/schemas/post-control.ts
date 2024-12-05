import { platformLabelEnum, postConfig } from '@/configs'
import { z } from 'zod'
// import { type IdParamType, idParamSchema } from './base'

export const postControlImportJsonSchema = z.object({
  importPosts: z.array(z.object({
    content: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    platform: z.enum(platformLabelEnum).optional(),
    platformImages: z.array(z.string()).max(postConfig.postMaxImages),
    platformId: z.string().nullable().optional(),
    platformLink: z.string().nullable().optional(),
    platformParentId: z.string().nullable().optional(),
    isDeleted: z.boolean().optional()
  }))
})
export type PostControlImportJsonType = z.infer<typeof postControlImportJsonSchema>
