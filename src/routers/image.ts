import { AppError } from '@/classes'
import { imageUpdateConfigJsonSchema, imageUpdateJsonSchema } from '@/schemas'
import { imageGetConfigService, imageSendService, imageUpdateConfigService, imageUpdateService } from '@/services'
import { useAdminSystem } from '@/systems'
import { type UserJwtVariables } from '@/types'
import { handleImageInFromData, handleResData, zValWEH } from '@/utils'
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

    c.status(201)
    return c.json(handleResData(0, '发送成功', data))
  }
)

router.patch(
  '/',
  zValWEH('json', imageUpdateJsonSchema),
  async (c) => {
    const imageInfo = c.req.valid('json')

    const data = await imageUpdateService(imageInfo)

    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.get(
  '/config',
  (c) => {
    const data = imageGetConfigService()
    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

router.put(
  '/config',
  zValWEH('json', imageUpdateConfigJsonSchema),
  (c) => {
    const configInfo = c.req.valid('json')

    imageUpdateConfigService(configInfo)

    c.status(200)
    return c.json(handleResData(0, '修改成功'))
  }
)

export default router
