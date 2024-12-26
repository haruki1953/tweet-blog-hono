import type { AdminStore, FileStore, ForwardStore, ProfileStore } from '@/types'
import { cloneDeep } from 'lodash'
import path from 'path'

export const systemDataPath = path.join(__dirname, '../../data/')

const storeDefaultAdmin: AdminStore = {
  username: 'admin',
  password: 'adminadmin', // 将被哈希
  jwtAdminSecretKey: 'Will randomly generate', // 将会随机生成
  jwtAdminExpSeconds: 10 * 24 * 60 * 60, // 10 days
  loginMaxFailCount: 10,
  loginLockSeconds: 10 * 60 * 60, // 10 hours
  proxyAddressHttp: ''
  // 算了，感觉也没必要，需要的话还是手动设置吧
  // 默认从系统代理获取，注意这是默认数据，只会在初始化时被保存
  // 所以在 src\systems\admin\init.ts 又进行了额外的判断
  // 如果 store.proxyAddressHttp 为 '' 则将保存为这个的 proxyAddressHttp
  // proxyAddressHttp: process.env.HTTP_PROXY ?? ''
}
export const systemAdminConfig = {
  storeFile: path.join(systemDataPath, 'admin.json'),
  storeDefault: () => cloneDeep(storeDefaultAdmin),
  passwordSaltRounds: 10
}

export const systemPublicPath = path.join(__dirname, '../../data/public/')

const imageSavePath = path.join(systemPublicPath, 'image/')
const avatarSavePath = path.join(systemPublicPath, 'avatar/')
const iconSavePath = path.join(systemPublicPath, 'icon/')

const storeDefaultFile: FileStore = {
  imageLargeMaxLength: 3000,
  imageSmallMaxLength: 600,
  imageQuality: 90
}
export const systemFileConfig = {
  storeFile: path.join(systemDataPath, 'file.json'),
  storeDefault: () => cloneDeep(storeDefaultFile),
  imageSavePath,
  originalImageSavePath: path.join(imageSavePath, 'original/'),
  largeImageSavePath: path.join(imageSavePath, 'large/'),
  smallImageSavePath: path.join(imageSavePath, 'small/'),
  imageExtension: '.jpeg',
  avatarSavePath,
  iconSavePath
}

const storeDefaultProfile: ProfileStore = {
  avatar: null,
  avatarArray: [],
  name: '',
  bio: '',
  socialMedias: [],
  aboutMarkdown: '# 一级标题\n\n## 二级标题\n\n### 三级标题\n\n这是一个段落，包含了一些**粗体**和*斜体*文本。\n\n这是一个带有链接的段落。\n\n- 这是一个无序列表项\n- 这是另一个无序列表项\n  - 这是一个嵌套的无序列表项\n\n1. 这是一个有序列表项\n2. 这是另一个有序列表项\n\n> 这是一个引用块，用于引用文本。\n\n这是一个内嵌代码块：`console.log(\'Hello, world!\');`\n\n```\n这是一个多行代码块：\nfunction greet() {\n console.log(\'Hello, world!\');\n}\ngreet();\n```\n\n---\n\n这是一个分割线（水平线）。\n\n这是一个包含删除线的文本：~~这是一段已删除的文本。~~\n\n| 表头1 | 表头2 |\n|-------|-------|\n| 单元格1 | 单元格2 |\n| 单元格3 | 单元格4 |\n',
  externalLinks: [],
  externalIcons: []
}
export const systemProfileConfig = {
  storeFile: path.join(systemDataPath, 'profile.json'),
  storeDefault: () => cloneDeep(storeDefaultProfile)
}

const storeDefaultForward: ForwardStore = {
  forwardSettingList: []
}
export const systemForwardConfig = {
  storeFile: path.join(systemDataPath, 'forward.json'),
  storeDefault: () => cloneDeep(storeDefaultForward)
}
