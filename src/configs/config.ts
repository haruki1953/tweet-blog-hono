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
}

// 关于导入与导出，平台所代表字段
export const platformLabelMap = {
  twitter: 'Twitter'
} as const
export const platformLabelEnum = ['Twitter'] as const
