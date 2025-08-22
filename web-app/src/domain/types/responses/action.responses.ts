import type { Action } from '../entities/action.types'

export interface CreateActionResponse {
  message: string
  action: Action
  totalDone: number
}

export interface GetRecentActionsResponse {
  message: string
  actions: Action[]
  total: number
}