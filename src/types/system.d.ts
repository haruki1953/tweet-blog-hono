export interface AdminStore {
  username: string
  password: string
  jwtAdminSecretKey: string
  jwtAdminExpSeconds: number
  loginMaxFailCount: number
  loginLockSeconds: number
}
