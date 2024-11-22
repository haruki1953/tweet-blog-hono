import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { httpPort } from './configs'
import { apiRouter, staticRouter } from './routers'
import { handleGlobalError, handleResData } from './helpers'

const app = new Hono()

app.use(cors())

app.route('/api', apiRouter)
app.route('/', staticRouter)

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
