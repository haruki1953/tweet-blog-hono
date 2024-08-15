import { z } from 'zod'

const id = z.number().int().positive()

export const postSendJsonSchema = z.object({
  content: z.string(),
  images: z.array(id).max(4),
  createdAt: z.coerce.date()
    .min(new Date('1900-01-01'), { message: 'Too old' })
    .optional(),
  parentPostId: id.optional(),
  twitterId: z.string().optional(),
  twitterLink: z.string().optional()
})

export type PostSendJsonType = z.infer<typeof postSendJsonSchema>
