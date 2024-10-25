import { profileUpdateAboutMdJsonSchema, profileUpdateNameBioJsonSchema, profileUpdateSocialMediasJsonSchema } from '@/schemas'
import { profileAddAvatarService, profileGetDataService, profileGetStoreService, profileUpdateAboutMdService, profileUpdateNameBioService, profileUpdateSocialMediasService } from '@/services'
import { handleImageInFormData, handleResData, zValWEH } from '@/helpers'
import { Hono } from 'hono'
import { type UserJwtVariables } from '@/types'
import { useAdminSystem } from '@/systems'
import { jwt } from 'hono/jwt'
import { AppError } from '@/classes'

const router = new Hono<{ Variables: UserJwtVariables }>()

const adminSystem = useAdminSystem()
router.use(jwt({ secret: adminSystem.getJwtAdminSecretKey() }))

router.get(
  '/test',
  async (c) => {
    c.status(200)
    return c.json(handleResData(0, '测试成功'))
  }
)

router.get(
  '/data',
  async (c) => {
    // 帖子、图片统计
    const data = await profileGetDataService()

    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

router.get(
  '/store',
  async (c) => {
    // profileStore信息
    const data = await profileGetStoreService()

    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

router.get(
  '/all',
  async (c) => {
    // 获取全部信息，包括profileStore信息，帖子、图片统计
    const database = await profileGetDataService()
    const store = await profileGetStoreService()

    const data = {
      data: database,
      store
    }
    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

router.put(
  '/name-bio',
  zValWEH('json', profileUpdateNameBioJsonSchema),
  async (c) => {
    const { name, bio } = c.req.valid('json')
    const data = profileUpdateNameBioService(name, bio)

    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.put(
  '/about-md',
  zValWEH('json', profileUpdateAboutMdJsonSchema),
  async (c) => {
    const { aboutMarkdown } = c.req.valid('json')
    const data = profileUpdateAboutMdService(aboutMarkdown)

    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.put(
  '/social-medias',
  zValWEH('json', profileUpdateSocialMediasJsonSchema),
  async (c) => {
    const { socialMedias } = c.req.valid('json')
    const data = profileUpdateSocialMediasService(socialMedias)

    c.status(200)
    return c.json(handleResData(0, '修改成功', data))
  }
)

router.post(
  '/avatar',
  async (c) => {
    const formData = await c.req.formData().catch(() => {
      throw new AppError('未上传表单')
    })
    const imageFile = handleImageInFormData(formData, 'image')

    const data = await profileAddAvatarService(imageFile)

    c.status(201)
    return c.json(handleResData(0, '修改成功', data))
  }
)

export default router
