import { handleResData } from '@/utils'
import { Hono } from 'hono'

const router = new Hono()

router.get('/', (c) => {
  c.status(200)
  return c.json(handleResData(0, 'hello hono'))
})

export default router
