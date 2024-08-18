import { z } from 'zod'

export const idParamSchema = z.object({
  // Coercion for primitives
  id: z.coerce.number().int().positive()
})

export type IdParamType = z.infer<typeof idParamSchema>
