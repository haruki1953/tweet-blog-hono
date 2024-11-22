import publicRouter from './public'
import adminRouter from './admin'
import postRouter from './post'
import imageRouter from './image'
import profileRouter from './profile'
import staticRouter from './static'
import { Hono } from 'hono'

const apiRouter = new Hono()

apiRouter.route('/public', publicRouter)
apiRouter.route('/admin', adminRouter)
apiRouter.route('/post', postRouter)
apiRouter.route('/image', imageRouter)
apiRouter.route('/profile', profileRouter)

export {
  apiRouter,
  staticRouter
}
