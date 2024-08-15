import { AppError } from '@/classes'
import { imageSendService } from '@/services'
import { useAdminSystem } from '@/systems'
import { type UserJwtVariables } from '@/types'
import { handleImageInFromData, handleResData } from '@/utils'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const router = new Hono<{ Variables: UserJwtVariables }>()

const adminSystem = useAdminSystem()
router.use(jwt({ secret: adminSystem.getJwtAdminSecretKey() }))

router.post(
  '/',
  async (c) => {
    const formData = await c.req.formData().catch(() => {
      throw new AppError('未上传表单')
    })

    const imageFile = handleImageInFromData(formData, 'image')

    const data = await imageSendService(imageFile)

    c.status(200)
    return c.json(handleResData(0, '发送成功', data))
  }
)

export default router
