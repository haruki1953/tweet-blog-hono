import { postConfig } from '@/configs'
import { z } from 'zod'

const id = z.number().int().positive()

export const postSendJsonSchema = z.object({
  content: z.string().optional(),
  images: z.array(id).max(postConfig.postMaxImages).optional(),
  createdAt: z.coerce.date()
    .min(new Date('1900-01-01'), { message: 'Too old' })
    .optional(),
  parentPostId: id.nullable().optional(),
  twitterId: z.string().nullable().optional(),
  twitterLink: z.string().nullable().optional(),
  isDeleted: z.boolean().optional()
})

export type PostSendJsonType = z.infer<typeof postSendJsonSchema>

export const postUpdateJsonSchema = postSendJsonSchema.extend({ id })

export type PostUpdateJsonType = z.infer<typeof postUpdateJsonSchema>

export const postDeleteParamSchema = z.object({
  // Coercion for primitives
  id: z.coerce.number().int().positive()
})

export type PostDeleteParamType = z.infer<typeof postDeleteParamSchema>
