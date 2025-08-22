import type { Group } from './group.types'
import type { Task } from './task.types'

export interface Tag {
  id: number
  label: string
  color: string
  group: Group
  tasks: Task[]
  createdAt: string
  updatedAt: string
}