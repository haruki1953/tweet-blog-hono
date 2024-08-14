import { useAdminSystem } from '@/systems'
import { sign } from 'hono/jwt'

const adminSystem = useAdminSystem()

export const generateTokenAdmin = async (
  payloadStr: string
) => {
  const payload = {
    payloadStr,
    exp: Math.floor(Date.now() / 1000) + adminSystem.getJwtAdminExpSeconds()
  }
  const token = await sign(payload, adminSystem.getJwtAdminSecretKey())
  return token
}
