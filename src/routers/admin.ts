import { adminUpdateAuthJsonSchema, adminUpdateInfoJsonSchema } from '@/schemas'
import { adminGetInfoService, adminUpdateAuthService, adminUpdateInfoService } from '@/services'
import { useAdminSystem } from '@/systems'
import { type UserJwtVariables } from '@/types'
import { handleResData, zValWEH } from '@/helpers'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const router = new Hono<{ Variables: UserJwtVariables }>()

const adminSystem = useAdminSystem()
router.use(jwt({ secret: adminSystem.getJwtAdminSecretKey() }))

router.put(
  '/auth',
  zValWEH('json', adminUpdateAuthJsonSchema),
  async (c) => {
    const {
      username, password
    } = c.req.valid('json')

    adminUpdateAuthService(username, password)

    c.status(200)
    return c.json(handleResData(0, '修改成功'))
  }
)

router.get(
  '/info',
  (c) => {
    const data = adminGetInfoService()
    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

router.put(
  '/info',
  zValWEH('json', adminUpdateInfoJsonSchema),
  (c) => {
    const adminInfo = c.req.valid('json')

    adminUpdateInfoService(adminInfo)
    c.status(200)
    return c.json(handleResData(0, '修改成功'))
  }
)

export default router
