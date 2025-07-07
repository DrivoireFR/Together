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

export interface Task {
  id: number
  label: string
  iconUrl?: string
  frequenceEstimee: number
  uniteFrequence: 'jour' | 'semaine' | 'mois'
  group: Group
  tag?: Tag
  actions: Action[]
  createdAt: string
  updatedAt: string
}

export interface Action {
  id: number
  date: string
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

// Payloads pour les requêtes
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  nom: string
  email: string
  password: string
}

export interface CreateGroupPayload {
  nom: string
}

export interface JoinGroupPayload {
  groupId: number
}

export interface CreateTaskPayload {
  label: string
  frequenceEstimee: number
  uniteFrequence: 'jour' | 'semaine' | 'mois'
  groupId: number
  tagId?: number
  iconUrl?: string
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

// Responses de l'API
export interface AuthResponse {
  token: string
  user: User
}

export interface GroupSearchResponse {
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