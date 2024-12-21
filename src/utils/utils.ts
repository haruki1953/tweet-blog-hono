import { AppError } from '@/classes'
import crypto from 'crypto'
import fs from 'fs'
import moment from 'moment-timezone'

// 生成随机密钥
export const generateRandomKey = () => {
  return crypto.randomBytes(32).toString('base64')
}

// 确保保存文件的文件夹存在
export const confirmSaveFolderExists = (dirPath: string) => {
  try {
    // 检查文件夹是否存在
    fs.accessSync(dirPath)
  } catch (err) {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
    } catch (error) {
      throw new AppError(`保存目录错误 ${dirPath}`, 500)
    }
  }
}

// str to date
export const strBeijingToDate = async (str: string) => {
  // 解析日期并设置时区为北京时间
  const beijingMoment = moment.tz(str, 'Asia/Shanghai').utc()
  // 检查日期是否有效
  if (!beijingMoment.isValid()) {
    throw new AppError('日期无效')
  }
  return beijingMoment.toDate()
}

// str to number
export const strToNumber = async (str: string) => {
  const num = parseInt(str)
  if (isNaN(num)) {
    throw new AppError('无法解析为数字')
  }
  return num
}

export const randomIntPadStart2 = () => {
  const randomInt = Math.floor(Math.random() * 100)
  return randomInt.toString().padStart(2, '0')
}

export const getFileExtension = (filename: string) => {
  // 将包含点，如.jpg
  // 使用正则表达式匹配文件名中的后缀名
  const match = filename.match(/(\.[a-zA-Z0-9]+)$/)
  return (match != null) ? match[1] : ''
}

// 处理敏感的令牌
export const maskSensitiveToken = (token: string) => {
  if (token.length > 10) {
    // 保留后6个字符
    const lastSix = token.slice(-6)
    // 前面加上4个星号
    const maskedToken = '****' + lastSix
    return maskedToken
  } else {
    // 去除前4个字符
    const trimmedToken = token.slice(4)
    // 前面加上4个星号
    const maskedToken = '****' + trimmedToken
    return maskedToken
  }
}

// 检查是否重复
export const checkForDuplicateStrings = (arr: string[]) => {
  const set = new Set(arr)
  return set.size !== arr.length
}
