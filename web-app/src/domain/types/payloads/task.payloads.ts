import type { UniteFrequence } from '../entities/task.types'

export interface CreateTaskPayload {
  label: string
  iconUrl?: string
  frequenceEstimee: number
  uniteFrequence: UniteFrequence
  groupId: number
  tagId?: number
  points: number
}

export interface UpdateTaskPayload {
  label: string
  iconUrl?: string
  frequenceEstimee: number
  uniteFrequence: UniteFrequence
  tagId?: number
  points: number
}

export interface UpdateUserTaskStatePayload {
  isAcknowledged?: boolean
  isConcerned?: boolean
}