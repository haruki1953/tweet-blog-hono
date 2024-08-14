import { AppError } from '@/classes'
import { type StatusCode } from 'hono/utils/http-status'
import { handleResData } from './data'
import { HTTPException } from 'hono/http-exception'
import { type Hono } from 'hono'

// handle error (call in services function on catch error)
export const handleAppError = (
  error: any, message: string, statusCode?: StatusCode, errorCode?: number
): void => {
  if (error instanceof AppError) {
    error.message = `${message} | ${error.message}`
    if (statusCode !== undefined) error.statusCode = statusCode
    if (errorCode !== undefined) error.errorCode = errorCode
    throw error
  } else {
    throw new AppError(`${message}`, statusCode)
  }
}

// handle global error
export const handleGlobalError: Parameters<Hono['onError']>[0] = (error, c) => {
  // handle AppError
  if (error instanceof AppError) {
    c.status(error.statusCode ?? 500)
    return c.json(handleResData(
      error.errorCode ?? 1,
      error.message
    ))
  }

  // handle HTTPException
  // for example: Malformed JSON in request body
  if (error instanceof HTTPException) {
    // console.log(error) // !!! for test、
    c.status(error.status)
    return c.json(handleResData(1, error.message))
  }

  // unknown error
  c.status(500)
  return c.json(handleResData(1, `unknown error: ${error.message}`))
}
