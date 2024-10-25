import path from 'path'

export const systemDataPath = path.join(__dirname, '../../data/')

export const systemAdminConfig = {
  storeFile: path.join(systemDataPath, 'admin.json'),
  storeDefault: {
    username: 'admin',
    password: 'adminadmin',
    jwtAdminExpSeconds: 100 * 24 * 60 * 60, // Token expires in 100 days
    loginMaxFailCount: 10,
    loginLockSeconds: 1 * 60 * 60 // 1hour
  }
}

const imageSavePath = path.join(systemDataPath, 'public/image/')
const avatarSavePath = path.join(systemDataPath, 'public/avatar/')
const iconSavePath = path.join(systemDataPath, 'public/icon/')

export const systemFileConfig = {
  storeFile: path.join(systemDataPath, 'file.json'),
  storeDefault: {
    imageLargeMaxLength: 1600,
    imageSmallMaxLength: 600,
    imageQuality: 85
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
    aboutMarkdown: '',
    externalLinks: [],
    externalIcons: []
  }
}
