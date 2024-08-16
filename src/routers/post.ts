import { postDeleteParamSchema, postSendJsonSchema, postUpdateJsonSchema } from '@/schemas'
import { postDeleteAllService, postDeleteService, postSendService, postUpdateService } from '@/services'
import { useAdminSystem } from '@/systems'
import { type UserJwtVariables } from '@/types'
import { handleResData, zValWEH } from '@/utils'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const router = new Hono<{ Variables: UserJwtVariables }>()

const adminSystem = useAdminSystem()
router.use(jwt({ secret: adminSystem.getJwtAdminSecretKey() }))

router.post(
  '/',
  zValWEH('json', postSendJsonSchema),
  async (c) => {
    const postInfo = c.req.valid('json')

    const data = await postSendService(postInfo)

    c.status(200)
    return c.json(handleResData(0, '发送成功', data))
  }
)

router.put(
  '/',
  zValWEH('json', postUpdateJsonSchema),
  async (c) => {
    const postInfo = c.req.valid('json')

    const data = await postUpdateService(postInfo)

    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.delete(
  '/id/:id',
  zValWEH('param', postDeleteParamSchema),
  async (c) => {
    const { id } = c.req.valid('param')
    const data = await postDeleteService(id)
    c.status(200)
    return c.json(handleResData(0, '删除成功', data))
  }
)

router.delete(
  '/all',
  async (c) => {
    const data = await postDeleteAllService()
    c.status(200)
    return c.json(handleResData(0, '删除成功', data))
  }
)

export default router
