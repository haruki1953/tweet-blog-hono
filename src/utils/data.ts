import { AppError } from '@/classes'
import type { ResData } from '@/types'

// handle response data
export const handleResData = (
  code: number, message: string, data?: any
): ResData => {
  return {
    code,
    message,
    data
  }
}

export const handleFileInFromData = (
  fromData: FormData, fieldname: string
) => {
  const file = fromData.get(fieldname)
  if (file == null || typeof file === 'string') {
    throw new AppError('表单格式错误')
  }
  return file
}

export const handleImageInFromData = (
  fromData: FormData, fieldname: string
) => {
  const file = handleFileInFromData(fromData, fieldname)
  if (!file.type.startsWith('image/')) {
    throw new AppError('请上传图片文件')
  }
  return file
}

export const getFileExtension = (filename: string) => {
  // 使用正则表达式匹配文件名中的后缀名
  const match = filename.match(/(\.[a-zA-Z0-9]+)$/)
  return (match != null) ? match[1] : ''
}
