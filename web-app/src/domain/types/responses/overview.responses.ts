import type { Action } from '../entities/action.types'
import type { UserWithActions, User } from '../entities/user.types'
import type { Task } from '../entities/task.types'

// Types pour la réponse Overview
export interface MonthlyVolumeItem {
  taskId: number
  taskLabel: string
  monthlyFrequency: number
  points: number
  monthlyPoints: number
  tag: {
    id: number
    label: string
    color: string
  } | null
}

export interface Overview {
  totalTasksVolume: number,
  totalDone: number,
  actions: Action[],
  users: UserWithActions[],
  tasks: Task[],
}

export interface PersonalGoal {
  user: User
  doneThisMonth: number
}

export interface GetOverviewResponse {
  message: string
  overview: Overview
}