import { adminLoginJsonSchema } from '@/schemas'
import { adminLoginService } from '@/services'
import { handleResData, zValWEH } from '@/helpers'
import { Hono } from 'hono'
import { useLogUtil } from '@/utils'
import { AppError } from '@/classes'

const router = new Hono()

const logUtil = useLogUtil()

router.post(
  '/admin-login',
  zValWEH('json', adminLoginJsonSchema),
  async (c) => {
    const {
      username, password
    } = c.req.valid('json')

    // 获取请求信息
    const xForwardedFor = c.req.header('x-forwarded-for')
    const xRealIp = c.req.header('x-real-ip')
    const userAgent = c.req.header('user-agent')
    const referer = c.req.header('referer')

    const token = await adminLoginService(username, password).catch((error) => {
      if (!(error instanceof AppError)) {
        throw error
      }
      const title = '登录失败 | ' + error.message

      logUtil.warning({
        title,
        content:
        `x-forwarded-for: ${xForwardedFor}\n` +
        `x-real-ip: ${xRealIp}\n` +
        `user-agent: ${userAgent}\n` +
        `referer: ${referer}\n`
      })
      throw error
    })
    logUtil.success({
      title: '登陆成功',
      content:
      `x-forwarded-for: ${xForwardedFor}\n` +
      `x-real-ip: ${xRealIp}\n` +
      `user-agent: ${userAgent}\n` +
      `referer: ${referer}\n`
    })

    c.status(200)
    return c.json(handleResData(0, '登陆成功', token))
  }
)

export default router
