import type { Task } from '../entities/task.types'

export interface CreateTaskResponse {
  message: string
  task: Task
}

export interface UpdateTaskResponse {
  message: string
  task: Task
}