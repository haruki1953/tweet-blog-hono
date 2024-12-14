import { cache } from './denpendencies'

export const taskCache = () => {
  const { importTaskList } = cache
  return {
    importTaskList
  }
}
