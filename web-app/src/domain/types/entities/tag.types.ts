import type { Group } from './group.types'
import type { Task } from './task.types'
import type { Icon } from '@/shared/types/enums'

export interface Tag {
  id: number
  label: string
  color: string
  icon?: Icon
  group: Group
  tasks: Task[]
  createdAt: string
  updatedAt: string
}