import { useTaskSystem } from '@/systems/task'

const taskSystem = useTaskSystem()

// 后端启动时的操作，将在index调用
export const startInitService = () => {
  taskSystem.resetTasksRunningToStopped()
}
