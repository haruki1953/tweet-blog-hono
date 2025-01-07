import { type TaskStore } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { store, save } from './denpendencies'
import { cloneDeep } from 'lodash'
import { taskStatusMap } from '@/configs'

type ImportTaskItem = TaskStore['taskImportList'][number]

type ImportTaskItemForCreateData = Partial<ImportTaskItem>
type ImportTaskItemForUpdateData = Partial<ImportTaskItem>

// 任务开始时，创建任务记录
export const taskImportCreate = (data: ImportTaskItemForCreateData) => {
  const {
    uuid = uuidv4(),
    startedAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    totalCount = 1,
    completedCount = 0,
    // 默认是运行中
    status = taskStatusMap.running.key
  } = data

  const storeNew = cloneDeep(store)

  const taskImportItem = {
    uuid,
    startedAt,
    updatedAt,
    totalCount,
    completedCount,
    status
  }
  storeNew.taskImportList.push(taskImportItem)

  save(storeNew)
  return taskImportItem
}

export const taskImportRead = () => {
  return store.taskImportList
}

export const taskImportUpdate = (uuid: string, data: ImportTaskItemForUpdateData) => {
  const storeNew = cloneDeep(store)

  const findImportTaskItemIndex = storeNew.taskImportList.findIndex(i => i.uuid === uuid)
  if (findImportTaskItemIndex === -1) {
    return null
  }
  const findImportTaskItem = storeNew.taskImportList[findImportTaskItemIndex]

  const taskImportItem = {
    ...findImportTaskItem,
    updatedAt: new Date().toISOString(),
    ...data
  }
  storeNew.taskImportList[findImportTaskItemIndex] = taskImportItem

  save(storeNew)
  return taskImportItem
}

export const taskImportDelete = (uuid: string) => {
  const storeNew = cloneDeep(store)

  const findImportTaskItemIndex = storeNew.taskImportList.findIndex(i => i.uuid === uuid)
  if (findImportTaskItemIndex === -1) {
    return null
  }
  const findImportTaskItem = storeNew.taskImportList[findImportTaskItemIndex]

  storeNew.taskImportList.splice(findImportTaskItemIndex, 1)

  save(storeNew)
  return findImportTaskItem
}
