import { type TaskCache } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { cache } from './denpendencies'

type ImportTaskItem = TaskCache['importTaskList'][number]

type ImportTaskItemForCreateData = Partial<ImportTaskItem>
type ImportTaskItemForUpdateData = Partial<ImportTaskItem>

export const importTaskCreate = (data: ImportTaskItemForCreateData) => {
  const {
    uuid = uuidv4(),
    startAt = new Date().toISOString(),
    totalCount = 0,
    completedCount = 0
  } = data

  const importTaskItem = {
    uuid,
    startAt,
    totalCount,
    completedCount
  }
  cache.importTaskList.push(importTaskItem)
  return importTaskItem
}

export const importTaskRead = () => {
  return cache.importTaskList
}

export const importTaskUpdate = (uuid: string, data: ImportTaskItemForUpdateData) => {
  const findImportTaskItemIndex = cache.importTaskList.findIndex(i => i.uuid === uuid)
  if (findImportTaskItemIndex === -1) {
    return null
  }
  const findImportTaskItem = cache.importTaskList[findImportTaskItemIndex]

  const importTaskItem = {
    ...findImportTaskItem,
    ...data
  }
  cache.importTaskList[findImportTaskItemIndex] = importTaskItem

  return importTaskItem
}

export const importTaskDelete = (uuid: string) => {
  const findImportTaskItemIndex = cache.importTaskList.findIndex(i => i.uuid === uuid)
  if (findImportTaskItemIndex === -1) {
    return null
  }
  const findImportTaskItem = cache.importTaskList[findImportTaskItemIndex]

  cache.importTaskList.splice(findImportTaskItemIndex, 1)
  return findImportTaskItem
}
