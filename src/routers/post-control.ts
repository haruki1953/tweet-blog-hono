import { } from '@/schemas'
import { postControlImportService } from '@/services'
import { useAdminSystem } from '@/systems'
import { type UserJwtVariables } from '@/types'
import { handleResData, zValWEH } from '@/helpers'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { postControlImportJsonSchema } from '@/schemas/post-control'

const router = new Hono<{ Variables: UserJwtVariables }>()

const adminSystem = useAdminSystem()
// router.use(jwt({ secret: adminSystem.getJwtAdminSecretKey() }))
router.use(async (c, next) => {
  // 动态获取最新的 JWT 密钥
  const secret = adminSystem.getJwtAdminSecretKey()
  // 使用获取到的密钥调用 JWT 中间件
  await jwt({ secret })(c, next)
})

router.post(
  '/import',
  zValWEH('json', postControlImportJsonSchema),
  async (c) => {
    const json = c.req.valid('json')

    postControlImportService(json).catch(() => {})

    c.status(200)
    return c.json(handleResData(0, '正在导入'))
  }
)

export default router
