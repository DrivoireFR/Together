import type { Group } from '../entities/group.types'

export interface FetchGroupResponse {
  message: string
  group: Group
}

export interface CreateGroupResponse {
  message: string
  group: Group
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