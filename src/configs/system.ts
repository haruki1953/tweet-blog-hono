import path from 'path'
// import { fileURLToPath } from 'url'

// // eslint-disable-next-line @typescript-eslint/naming-convention
// const __filename = fileURLToPath(import.meta.url)
// // eslint-disable-next-line @typescript-eslint/naming-convention
// const __dirname = path.dirname(__filename)

export const systemDataPath = path.join(__dirname, '../../data/')

export const systemAdminConfig = {
  storeFile: path.join(systemDataPath, 'admin.json'),
  storeDefault: {
    username: 'admin',
    password: 'adminadmin',
    jwtAdminExpSeconds: 10 * 24 * 60 * 60, // Token expires in 10 days
    loginMaxFailCount: 10,
    loginLockSeconds: 1 * 60 * 60 // 1hour
  }
}

export const systemPublicPath = path.join(__dirname, '../../data/public/')

const imageSavePath = path.join(systemPublicPath, 'image/')
const avatarSavePath = path.join(systemPublicPath, 'avatar/')
const iconSavePath = path.join(systemPublicPath, 'icon/')

export const systemFileConfig = {
  storeFile: path.join(systemDataPath, 'file.json'),
  storeDefault: {
    imageLargeMaxLength: 1600,
    imageSmallMaxLength: 600,
    imageQuality: 90
  },
  imageSavePath,
  originalImageSavePath: path.join(imageSavePath, 'original/'),
  largeImageSavePath: path.join(imageSavePath, 'large/'),
  smallImageSavePath: path.join(imageSavePath, 'small/'),
  imageExtension: '.jpg',
  avatarSavePath,
  iconSavePath
}

export const systemProfileConfig = {
  storeFile: path.join(systemDataPath, 'profile.json'),
  storeDefault: {
    avatar: null,
    avatarArray: [],
    name: '',
    bio: '',
    socialMedias: [],
    aboutMarkdown: '# 一级标题\n\n## 二级标题\n\n### 三级标题\n\n这是一个段落，包含了一些**粗体**和*斜体*文本。\n\n这是一个带有链接的段落。\n\n- 这是一个无序列表项\n- 这是另一个无序列表项\n  - 这是一个嵌套的无序列表项\n\n1. 这是一个有序列表项\n2. 这是另一个有序列表项\n\n> 这是一个引用块，用于引用文本。\n\n这是一个内嵌代码块：`console.log(\'Hello, world!\');`\n\n```\n这是一个多行代码块：\nfunction greet() {\n console.log(\'Hello, world!\');\n}\ngreet();\n```\n\n---\n\n这是一个分割线（水平线）。\n\n这是一个包含删除线的文本：~~这是一段已删除的文本。~~\n\n| 表头1 | 表头2 |\n|-------|-------|\n| 单元格1 | 单元格2 |\n| 单元格3 | 单元格4 |\n',
    externalLinks: [],
    externalIcons: []
  }
}
