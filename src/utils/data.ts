import { AppError } from '@/classes'
import type { ResData } from '@/types'

// handle response data
export const handleResData = (
  code: number, message: string, data?: any, token?: string
): ResData => {
  return {
    code,
    message,
    data,
    token
  }
}

export const handleFileInFromData = async (
  fromData: FormData, fieldname: string
) => {
  const file = fromData.get(fieldname)
  if (file == null || typeof file === 'string') {
    throw new AppError('表单格式错误')
  }
  return await file.arrayBuffer()
}
