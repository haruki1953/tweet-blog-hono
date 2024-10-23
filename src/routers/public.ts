import { adminLoginJsonSchema } from '@/schemas'
import { adminLoginService } from '@/services'
import { handleResData, zValWEH } from '@/helpers'
import { Hono } from 'hono'

const router = new Hono()

router.post(
  '/admin-login',
  zValWEH('json', adminLoginJsonSchema),
  async (c) => {
    const {
      username, password
    } = c.req.valid('json')

    const token = await adminLoginService(username, password)

    c.status(200)
    return c.json(handleResData(0, '登陆成功', token))
  }
)

export default router
