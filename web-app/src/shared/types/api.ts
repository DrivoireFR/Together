// Entités API
export interface User {
  id: number
  nom: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Group {
  id: number
  nom: string
  users: User[]
  tasks: Task[]
  actions: Action[]
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

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

export interface CreateTaskPayload {
  label: string
  iconUrl?: string
  frequenceEstimee: number
  uniteFrequence: UniteFrequence
  groupId: number
  tagId?: number
  points: number
}

export interface CreateTaskResponse {
  message: string
  task: Task
}

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

export interface Tag {
  id: number
  label: string
  color: string
  group: Group
  tasks: Task[]
  createdAt: string
  updatedAt: string
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

// Payloads pour les requêtes
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  nom: string
  prenom: string
  pseudo: string
  email: string
  password: string
  icone?: string
}

export interface CreateGroupPayload {
  nom: string
}

export interface JoinGroupPayload {
  groupId: number
}

export interface CreateTagPayload {
  label: string
  color: string
  groupId: number
}

export interface CreateActionPayload {
  taskId: number
  date: string
}

export interface CreateActionResponse {
  message: string
  action: Action
}

export interface GetRecentActionsResponse {
  message: string
  actions: Action[]
  total: number
}

export interface GroupStatistics {
  totalActions: number
  actionsByUser: Record<number, number>
  actionsByTask: Record<number, number>
  actionsByTag: Record<number, number>
  totalWeight: number
  actions: Action[]
}

export interface GetStatisticsResponse {
  message: string
  statistics: GroupStatistics
}

export interface UpdateUserTaskStatePayload {
  isAcknowledged?: boolean
  isConcerned?: boolean
}

// Responses de l'API
export interface AuthResponse {
  token: string
  user: User
}

export interface GroupSearchResponse {
  message: string
  groups: Group[]
}

export interface getProfileResponse {
  message: string
  user: User
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

// Types d'erreur
export interface ApiError {
  message: string
  statusCode: number
  timestamp: string
  path: string
}