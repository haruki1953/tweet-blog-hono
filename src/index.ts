import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { httpPort } from './configs'
import { publicRouter } from './routers'

const app = new Hono()

app.use(cors())

app.route('/public', publicRouter)

console.log(`Server is running on port ${httpPort}`)

serve({
  fetch: app.fetch,
  port: httpPort
})
