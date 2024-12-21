/*
  此文件在前后端中内容一致
  前端：src\config\platform.ts
  后端：src\configs\platform.ts

  如果添加平台，以下地方需要再次修改
  前端：src\types\data\forward.d.ts
  后端：src\schemas\types\forward.ts

  如果只是修改 data 数据，只在本文件修改即可
*/

import { z } from 'zod'

// 转发配置中，各平台所对应的 data 数据结构
const forwardSettingDataSchemaX = z.object({
  'API Key': z.string(),
  'API Key Secret': z.string(),
  'Access Token': z.string(),
  'Access Token Secret': z.string()
})
const forwardSettingDataSchemaT = z.object({
  token: z.string()
})
// data 数据例，前端要用
const forwardSettingDataDefaultX: z.infer<typeof forwardSettingDataSchemaX> = {
  'API Key': '',
  'API Key Secret': '',
  'Access Token': '',
  'Access Token Secret': ''
}
const forwardSettingDataDefaultT: z.infer<typeof forwardSettingDataSchemaT> = {
  token: ''
}
// 全部平台的 forwardSettingDataDefault
export const forwardSettingDataDefaultAll = {
  ...forwardSettingDataDefaultX,
  ...forwardSettingDataDefaultT
}

// 关于导入与导出所需的平台数据
export const platformKeyMap = {
  X: {
    key: 'X',
    name: 'X / Twitter',
    fontawesomeClass: 'fa-brands fa-x-twitter',
    // 是否支持导入或导出，这个会控制对应 radio 单选框
    couldImport: true,
    couldForward: true,
    // 转发配置中，data 的 schema 与 默认值
    forwardSettingDataSchema: forwardSettingDataSchemaX,
    forwardSettingDataDefault: forwardSettingDataDefaultX
  },
  T: {
    key: 'T',
    name: 'Test',
    fontawesomeClass: 'fa-brands fa-font-awesome',
    couldImport: true,
    couldForward: true,
    forwardSettingDataSchema: forwardSettingDataSchemaT,
    forwardSettingDataDefault: forwardSettingDataDefaultT
  }
} as const
// 这个手动写出来的原因是，zod枚举需要字面量类型数组
export const platformKeyEnum = ['X', 'T'] as const

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
