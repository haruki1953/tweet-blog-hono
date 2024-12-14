import {
  taskCache,
  importTaskCreate,
  importTaskRead,
  importTaskUpdate,
  importTaskDelete
} from './services'

export const useTaskSystem = () => {
  return {
    taskCache,
    importTaskCreate,
    importTaskRead,
    importTaskUpdate,
    importTaskDelete
  }
}
