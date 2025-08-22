import type { Group } from './group.types'
import type { Tag } from './tag.types'
import type { Action } from './action.types'
import type { UserTaskState } from './user.types'

export enum UniteFrequence {
  JOUR = 'jour',
  SEMAINE = 'semaine',
  MOIS = 'mois'
}

export interface Task {
  id: number
  label: string
  iconUrl?: string
  frequenceEstimee: number
  uniteFrequence: UniteFrequence
  points: number
  group: Group
  tag?: Tag
  actions: Action[]
  userTaskState?: UserTaskState | null
  createdAt: string
  updatedAt: string
}