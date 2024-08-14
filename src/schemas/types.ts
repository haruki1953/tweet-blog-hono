import { z } from 'zod'

export const typesAdminStoreSchema = z.object({
  username: z.string(),
  password: z.string(),
  jwtAdminSecretKey: z.string(),
  jwtAdminExpSeconds: z.number(),
  loginMaxFailCount: z.number(),
  loginLockSeconds: z.number()
})
