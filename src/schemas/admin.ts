import { z } from 'zod'

const username = z.string().regex(/^[a-zA-Z0-9_]{1,32}$/, {
  message: '用户名格式错误，长度1到32，只能包含字母、数字和下划线'
})

const password = z.string().regex(/^[a-zA-Z0-9_]{6,32}$/, {
  message: '密码格式错误，长度6到32，只能包含字母、数字和下划线'
})

export const adminLoginJsonSchema = z.object({
  username, password
})

export const adminUpdateAuthJsonSchema = z.object({
  username, password
})

export const adminUpdateInfoJsonSchema = z.object({
  jwtAdminExpSeconds: z.number().int().positive(),
  loginMaxFailCount: z.number().int().positive(),
  loginLockSeconds: z.number().int().positive()
})

export type AdminLoginJsonType = z.infer<typeof adminLoginJsonSchema>
export type AdminUpdateAuthJsonType = z.infer<typeof adminUpdateAuthJsonSchema>
export type AdminUpdateInfoJsonType = z.infer<typeof adminUpdateInfoJsonSchema>

export const adminUpdateProxyJsonSchema = z.object({
  proxyAddressHttp: z.string()
})
export type AdminUpdateProxyJsonType = z.infer<typeof adminUpdateProxyJsonSchema>

export const adminProxyTestJsonSchema = z.object({
  testAddress: z.string()
})
export type AdminProxyTestJsonType = z.infer<typeof adminProxyTestJsonSchema>
