import type { Action } from './action.types'

export interface User {
  id: number
  nom: string
  prenom: string
  pseudo: string
  icone?: string
  email: string
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