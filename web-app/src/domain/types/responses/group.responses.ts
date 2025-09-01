import type { Group } from '../entities/group.types'
import type { Tag } from '../entities/tag.types'
import type { Task } from '../entities/task.types'

export interface StarterPack {
  tags: Tag[]
  tasks: Task[]
}

export interface FetchGroupResponse {
  message: string
  group: Group
  hotActions?: {
    count: number
    tasks: any[]
  }
}

export interface CreateGroupResponse {
  message: string
  group: Group
  starterPack: StarterPack
}

export interface GroupSearchResponse {
  message: string
  groups: Group[]
}

export interface UserGroupResponse {
  message: string
  groups: Group[]
}

export interface StatisticsResponse {
  totalActions: number
  actionsByUser: Record<string, number>
  actionsByTask: Record<string, number>
}

export interface CreateBulkTagsResponse {
  message: string
  tags: Tag[]
}

export interface CreateBulkTasksResponse {
  message: string
  tasks: Task[]
}