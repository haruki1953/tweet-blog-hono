import { adminProxyTestJsonSchema, adminUpdateAuthJsonSchema, adminUpdateInfoJsonSchema, adminUpdateProxyJsonSchema, imageUpdateConfigJsonSchema } from '@/schemas'
import { adminGetInfoService, adminGetTaskService, adminProxyTestService, adminUpdateAuthService, adminUpdateInfoService, adminUpdateProxyService, imageUpdateConfigService } from '@/services'
import { useAdminSystem } from '@/systems'
import { type UserJwtVariables } from '@/types'
import { handleResData, zValWEH } from '@/helpers'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const router = new Hono<{ Variables: UserJwtVariables }>()

const adminSystem = useAdminSystem()

// router.use(jwt({ secret: adminSystem.getJwtAdminSecretKey() }))
router.use(async (c, next) => {
  // 动态获取最新的 JWT 密钥
  const secret = adminSystem.getJwtAdminSecretKey()
  // 使用获取到的密钥调用 JWT 中间件
  await jwt({ secret })(c, next)
})

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
    const data = adminGetInfoService()
    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.put(
  '/proxy',
  zValWEH('json', adminUpdateProxyJsonSchema),
  (c) => {
    const proxyInfo = c.req.valid('json')

    adminUpdateProxyService(proxyInfo)
    const data = adminGetInfoService()
    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.post(
  '/proxy-test',
  zValWEH('json', adminProxyTestJsonSchema),
  async (c) => {
    const json = c.req.valid('json')

    const data = await adminProxyTestService(json)

    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.put(
  '/image',
  zValWEH('json', imageUpdateConfigJsonSchema),
  (c) => {
    const configInfo = c.req.valid('json')

    imageUpdateConfigService(configInfo)
    const data = adminGetInfoService()
    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.get(
  'task',
  (c) => {
    const data = adminGetTaskService()
    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

export default router
