import path from 'path'

export const systemDataPath = path.join(__dirname, '../../data/')

export const systemAdminConfig = {
  storeFile: path.join(systemDataPath, 'admin.json')
}
