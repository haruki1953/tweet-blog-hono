// get backend port from env
let httpPort = Number(process.env.TWEET_BLOG_HONO_PORT)
// default port
if (Number.isNaN(httpPort)) {
  httpPort = 3000
}
export { httpPort }

export const postConfig = {
  postMaxImages: 4,
  postNumInPage: 20,
  imageNumInPage: 20
} as const
