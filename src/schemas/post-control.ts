import { postConfig } from '@/configs'
import { z } from 'zod'
// import { type IdParamType, idParamSchema } from './base'

export const postControlImportJsonSchema = z.object({
  importPosts: z.array(z.object({
    content: z.string(),
    imagesUrl: z.array(z.string()).max(postConfig.postMaxImages),
    createdAt: z.coerce.date().optional(),
    parentTwitterId: z.string().nullable().optional(),
    twitterId: z.string().nullable().optional(),
    twitterLink: z.string().nullable().optional(),
    isDeleted: z.boolean().optional()
  }))
})
export type PostControlImportJsonType = z.infer<typeof postControlImportJsonSchema>
