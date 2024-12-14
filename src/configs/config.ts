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

export const fetchProxyConfig = {
  testUrlDefault: 'https://www.google.com'
}

// 关于导入与导出，平台所代表字段
export const platformKeyMap = {
  x: {
    key: 'X',
    name: 'X / Twitter'
  }
} as const
export const platformKeyEnum = ['X'] as const

// 类型检查以确保 platformKeyEnum 与 platformKeyMap 的值是同步的
export type PlatformKeyMapValues = typeof platformKeyMap[keyof typeof platformKeyMap]['key']
export type PlatformKeyEnumValues = typeof platformKeyEnum[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const platformKeyMapTest: PlatformKeyMapValues[] = [...platformKeyEnum]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const platformKeyEnumTest: PlatformKeyEnumValues[] = Object.values(platformKeyMap).map(i => i.key)
