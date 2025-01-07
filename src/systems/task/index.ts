import {
  taskStore,
  resetTasksRunningToStopped,
  taskComplete,
  taskAbort,
  taskDelete,
  taskIsRunning,
  taskImportCreate,
  taskImportRead,
  taskImportUpdate,
  taskImportDelete
} from './services'

export const useTaskSystem = () => {
  return {
    taskStore,
    resetTasksRunningToStopped,
    taskComplete,
    taskAbort,
    taskDelete,
    taskIsRunning,
    taskImportCreate,
    taskImportRead,
    taskImportUpdate,
    taskImportDelete
  }
}
