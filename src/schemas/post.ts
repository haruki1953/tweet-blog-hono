import { postConfig } from '@/configs'
import { z } from 'zod'
import { type IdParamType, idParamSchema } from './base'

const id = z.string()

export const postSendJsonSchema = z.object({
  content: z.string().optional(),
  images: z.array(id).max(postConfig.postMaxImages).optional(),
  createdAt: z.coerce.date()
    // .min(new Date('1971-01-01'), { message: 'Too old' })
    .optional(),
  parentPostId: id.nullable().optional(),
  // twitterId: z.string().nullable().optional(),
  // twitterLink: z.string().nullable().optional(),
  isDeleted: z.boolean().optional()
})
export type PostSendJsonType = z.infer<typeof postSendJsonSchema>

export const postUpdateJsonSchema = postSendJsonSchema.extend({ id })
export type PostUpdateJsonType = z.infer<typeof postUpdateJsonSchema>

export const postDeleteParamSchema = idParamSchema
export type PostDeleteParamType = IdParamType

export const postDeleteQuerySchema = z.object({
  delateImage: z.enum(['true', 'false']).optional()
})
export type PostDeleteQueryType = z.infer<typeof postDeleteQuerySchema>

export const postDeleteAllQuerySchema = postDeleteQuerySchema
export type PostDeleteAllQueryType = z.infer<typeof postDeleteAllQuerySchema>

export const postGetByIdParamSchema = idParamSchema
export type PostGetByIdParamType = IdParamType

export const postGetByIdQuerySchma = z.object({
  keepIsDetele: z.enum(['true', 'false']).optional()
})
export type PostGetByIdQueryType = z.infer<typeof postGetByIdQuerySchma>

export const postGetByCursorParamSchma = z.object({
  id: z.string().optional()
})
export type PostGetByCursorParamType = z.infer<typeof postGetByCursorParamSchma>

export const postGetByCursorQuerySchma = z.object({
  content: z.string().optional(),
  isDelete: z.enum(['true', 'false', 'all']).optional()
})
export type PostGetByCursorQueryType = z.infer<typeof postGetByCursorQuerySchma>

export const postGetIsdelParamSchma = idParamSchema
export type PostGetIsdelParamType = IdParamType
