import { } from '@/schemas'
import { postControlDeleteImportDataService, postControlDeleteImportExcessService, postControlImportService } from '@/services'
import { useAdminSystem } from '@/systems'
import { type UserJwtVariables } from '@/types'
import { handleResData, zValWEH } from '@/helpers'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { postControlDeleteImportDataParamSchema, postControlForwardSettingSetJsonSchema, postControlImportJsonSchema } from '@/schemas/post-control'
import { postControlForwardGetService, postControlForwardSettingSetService } from '@/services/post-control/control-forward'

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

    const data = await postControlImportService(json)

    c.status(200)
    return c.json(handleResData(0, '正在导入', data))
  }
)

router.delete(
  '/import-data/id/:id',
  zValWEH('param', postControlDeleteImportDataParamSchema),
  async (c) => {
    const { id } = c.req.valid('param')

    const data = await postControlDeleteImportDataService(id)

    c.status(200)
    return c.json(handleResData(0, '删除成功', data))
  }
)

router.delete(
  '/import-data/excess',
  async (c) => {
    const data = await postControlDeleteImportExcessService()

    c.status(200)
    return c.json(handleResData(0, '删除成功', data))
  }
)

router.get(
  '/forward',
  async (c) => {
    const data = postControlForwardGetService()

    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

router.put(
  '/forward-setting',
  zValWEH('json', postControlForwardSettingSetJsonSchema),
  async (c) => {
    const json = c.req.valid('json')
    const data = postControlForwardSettingSetService(json)

    c.status(200)
    return c.json(handleResData(0, '设置成功', data))
  }
)

export default router
