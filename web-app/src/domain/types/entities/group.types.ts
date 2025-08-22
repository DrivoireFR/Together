import type { User } from './user.types'
import type { Task } from './task.types'
import type { Action } from './action.types'
import type { Tag } from './tag.types'

export interface Group {
  id: number
  nom: string
  code: string
  users: User[]
  tasks: Task[]
  actions: Action[]
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface GroupStatistics {
  totalActions: number
  actionsByUser: Record<number, number>
  actionsByTask: Record<number, number>
  actionsByTag: Record<number, number>
  totalWeight: number
  actions: Action[]
}