import { z } from 'zod'

export const imageUpdateJsonSchema = z.object({
  id: z.number().int().positive(),
  alt: z.string().nullable().optional(),
  twitterLargeImageLink: z.string().nullable().optional()
})

export type ImageUpdateJsonType = z.infer<typeof imageUpdateJsonSchema>

export const imageUpdateConfigJsonSchema = z.object({
  imageLargeMaxLength: z.number().int().positive(),
  imageSmallMaxLength: z.number().int().positive(),
  imageQuality: z.number().int().min(1).max(100)
})

export type ImageUpdateConfigJsonType = z.infer<typeof imageUpdateConfigJsonSchema>
