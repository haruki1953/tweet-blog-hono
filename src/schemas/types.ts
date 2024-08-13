import { z } from 'zod'

export const typesAdminStoreSchema = z.object({
  username: z.string(),
  password: z.string(),
  jwtMainSecretKey: z.string(),
  jwtAdminSecretKey: z.string()
})
