import type { Action } from './action.types'
import type { Avatar } from '@/shared/types/enums'

export interface User {
  id: number
  nom: string
  prenom: string
  pseudo: string
  avatar?: Avatar
  email: string
  emailVerified?: boolean
  createdAt: string
  updatedAt: string
}

export interface UserWithActions extends User {
  actions: Action[]
}

export interface UserTaskState {
  id: number
  taskId: number
  userId: number
  isAcknowledged: boolean
  isConcerned: boolean
  acknowledgedAt?: string
  concernedAt?: string
  createdAt: string
  updatedAt: string
}