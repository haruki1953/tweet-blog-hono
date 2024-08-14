import path from 'path'

export const systemDataPath = path.join(__dirname, '../../data/')

export const systemAdminConfig = {
  storeFile: path.join(systemDataPath, 'admin.json'),
  defaultUsername: 'admin',
  defaultPassword: 'adminadmin',
  defaultJwtAdminExpSeconds: 100 * 24 * 60 * 60, // Token expires in 100 days
  defaultLoginMaxFailCount: 10,
  defaultLoginLockSeconds: 1 * 60 * 60 // 1hour
}
