/*
  此文件在前后端中内容一致
  前端：src\config\platform.ts
  后端：src\configs\platform.ts

  对于推文导入（解析）的主要逻辑在前端：
    src\views\control\views\tweet-import\services\process.ts
  对于推文转发的主要逻辑在后端：
    src\services\post-control\control-forward\forward-post\forward-post.ts
*/

import { z } from 'zod'

// 转发配置中，各平台所对应的 data 数据结构
// X / Twitter
const forwardSettingDataSchemaX = z.object({
  'API Key': z.string(),
  'API Key Secret': z.string(),
  'Access Token': z.string(),
  'Access Token Secret': z.string()
})
// data 数据例，前端要用
const forwardSettingDataDefaultX: z.infer<typeof forwardSettingDataSchemaX> = {
  'API Key': '',
  'API Key Secret': '',
  'Access Token': '',
  'Access Token Secret': ''
}
// 添加 Telegram 所需的认证信息
const forwardSettingDataSchemaTelegram = z.object({
  'Bot Token': z.string(),
  'Chat Id': z.string()
})
const forwardSettingDataDefaultTelegram: z.infer<typeof forwardSettingDataSchemaTelegram> = {
  'Bot Token': '',
  'Chat Id': ''
}
// 全部平台的 forwardSettingDataDefault
export const forwardSettingDataDefaultAll = {
  ...forwardSettingDataDefaultX,
  ...forwardSettingDataDefaultTelegram
}

// 关于导入与导出所需的平台数据
export const platformKeyMap = {
  X: {
    key: 'X',
    name: 'X / Twitter',
    // https://fontawesome.com/v6/search?o=v&ic=brands
    fontawesomeClass: 'fa-brands fa-x-twitter',
    // 是否支持导入或导出，这个会控制对应 radio 单选框
    couldImport: true,
    couldForward: true,
    // 转发配置中，data 的 schema 与 默认值
    forwardSettingDataSchema: forwardSettingDataSchemaX,
    forwardSettingDataDefault: forwardSettingDataDefaultX
  },
  Telegram: {
    key: 'Telegram',
    name: 'Telegram',
    fontawesomeClass: 'fa-brands fa-telegram',
    couldImport: true,
    couldForward: true,
    forwardSettingDataSchema: forwardSettingDataSchemaTelegram,
    forwardSettingDataDefault: forwardSettingDataDefaultTelegram
  }
} as const
// 这个手动写出来的原因是，zod枚举需要字面量类型数组
export const platformKeyEnum = ['X', 'Telegram'] as const

// 类型检查以确保 platformKeyEnum 与 platformKeyMap 的值是同步的
export type PlatformKeyMapValues =
  | (typeof platformKeyMap)[keyof typeof platformKeyMap]['key']
  | keyof typeof platformKeyMap
export type PlatformKeyEnumValues = (typeof platformKeyEnum)[number]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const platformKeyMapTest: PlatformKeyMapValues[] = [] as PlatformKeyEnumValues[]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const platformKeyEnumTest: PlatformKeyEnumValues[] =
  [] as PlatformKeyMapValues[]
