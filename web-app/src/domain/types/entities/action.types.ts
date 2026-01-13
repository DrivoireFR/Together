import type { Task } from './task.types'
import type { User } from './user.types'
import type { Group } from './group.types'

export interface Action {
  id: number
  date: string
  isHelpingHand: boolean
  task: Task
  user: User
  group: Group
  createdAt: string
  updatedAt: string
}

// Types pour les vues d'overview
export interface ActionItem {
  id: number
  taskLabel: string
  points: number
  isHelpingHand: boolean
  tag: {
    id: number
    label: string
    color: string
  } | null
}

export interface UserDayActions {
  userName: string
  actions: ActionItem[]
}

export interface ActionsByDayAndUser {
  [dayKey: string]: {
    [userId: number]: UserDayActions
  }
}

export interface HelpingHandItem {
  id: number
  date: string
  taskLabel: string
  points: number
  tag: {
    id: number
    label: string
    color: string
  } | null
}

export interface HelpingHandByUser {
  [userId: number]: {
    userName: string
    helpingHands: HelpingHandItem[]
  }
}

export interface ActionsByCategory {
  tagId: number | null
  tagLabel: string
  tagColor: string
  totalMonthlyVolume: number
  completedThisMonth: number
  completionPercentage: number
  actionsCount: number
  tasksInCategory: number
}

export interface ActionAcknowledgment {
  id: number
  action: Action
  requestedBy: User  // Utilisateur qui a créé l'action
  requestedFor: User  // Utilisateur pour qui l'action a été créée
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}