import { cloneDeep } from 'lodash'
import { save, store } from './denpendencies'
import { taskStatusMap } from '@/configs'
import { taskImportDelete, taskImportUpdate } from './task-import'

export const taskStore = () => {
  const { taskImportList } = store
  return {
    taskImportList
  }
}

// 在后端启动时，将所有 running 的任务改为 stopped
export const resetTasksRunningToStopped = () => {
  const storeNew = cloneDeep(store)

  let taskImportRunningCount = 0
  for (const taskImportItem of storeNew.taskImportList) {
    if (taskImportItem.status === taskStatusMap.running.key) {
      taskImportItem.status = taskStatusMap.stopped.key
      taskImportRunningCount += 1
    }
  }

  save(storeNew)
  return {
    taskImportRunningCount
  }
}

export const taskComplete = (uuid: string) => {
  const findImportTask = store.taskImportList.find(i => i.uuid === uuid)
  if (findImportTask != null) {
    taskImportUpdate(uuid, {
      status: taskStatusMap.completed.key
    })
  }
}
export const taskAbort = (uuid: string) => {
  const findImportTask = store.taskImportList.find(i => i.uuid === uuid)
  if (findImportTask != null) {
    taskImportUpdate(uuid, {
      status: taskStatusMap.aborted.key
    })
  }
}
export const taskDelete = (uuid: string) => {
  const findImportTask = store.taskImportList.find(i => i.uuid === uuid)
  if (findImportTask != null) {
    taskImportDelete(uuid)
  }
}
export const taskIsRunning = (uuid: string) => {
  const findImportTask = store.taskImportList.find(i => i.uuid === uuid)
  if (findImportTask != null && findImportTask.status === taskStatusMap.running.key) {
    return true
  }
  return false
}
