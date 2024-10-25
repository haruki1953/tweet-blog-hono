import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { httpPort } from './configs'
import { adminRouter, imageRouter, postRouter, profileRouter, publicRouter } from './routers'
import { handleGlobalError, handleResData } from './helpers'

const app = new Hono()

app.use(cors())

app.route('/public', publicRouter)
app.route('/admin', adminRouter)
app.route('/post', postRouter)
app.route('/image', imageRouter)
app.route('/profile', profileRouter)

app.notFound((c) => {
  c.status(404)
  return c.json(handleResData(1, '404 Not Found'))
})

// global error handler
app.onError(handleGlobalError)

console.log(`Server is running on port ${httpPort}`)

serve({
  fetch: app.fetch,
  port: httpPort
})
