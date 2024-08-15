import { postSendJsonSchema } from '@/schemas'
import { postSendService } from '@/services'
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

export default router
