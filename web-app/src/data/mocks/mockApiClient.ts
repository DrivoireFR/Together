import { DataSuccess, DataError, type ApiResult } from '@/shared/types/DataResult'
import type { 
  User, 
  Group, 
  Task, 
  Action, 
  Tag, 
  UserTaskState,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  CreateTaskPayload,
  CreateTagPayload,
  CreateActionPayload,
  UpdateUserTaskStatePayload,
  CreateGroupPayload,
  JoinGroupPayload,
  StatisticsResponse
} from '@/shared/types/api'
import { 
  mockUsers, 
  mockGroup, 
  mockTasks, 
  mockActions, 
  mockTags, 
  mockUserTaskStates,
  mockCurrentUser,
  mockToken
} from './mockData'

// Simulation d'un délai réseau
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Compteur pour les nouveaux IDs
let nextId = 100

class MockApiClient {
  private isAuthenticated = false
  private currentUser: User | null = null

  // Simule une session utilisateur persistante
  constructor() {
    // Vérifier si l'utilisateur était connecté
    const token = localStorage.getItem('demo_token')
    if (token === mockToken) {
      this.isAuthenticated = true
      this.currentUser = mockCurrentUser
    }
  }

  // Authentication
  async login(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
    await delay()
    
    // Simuler une vérification basique
    if (payload.email === 'demo@example.com' && payload.password === 'demo123') {
      this.isAuthenticated = true
      this.currentUser = mockCurrentUser
      localStorage.setItem('demo_token', mockToken)
      
      return new DataSuccess({
        token: mockToken,
        user: mockCurrentUser
      })
    }
    
    return new DataError('Email ou mot de passe invalide', 401)
  }

  async register(payload: RegisterPayload): Promise<ApiResult<AuthResponse>> {
    await delay()
    
    // Simuler la création d'un nouvel utilisateur
    const newUser: User = {
      id: nextId++,
      nom: payload.nom,
      email: payload.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.isAuthenticated = true
    this.currentUser = newUser
    localStorage.setItem('demo_token', mockToken)
    
    return new DataSuccess({
      token: mockToken,
      user: newUser
    })
  }

  async logout(): Promise<ApiResult<void>> {
    await delay(100)
    this.isAuthenticated = false
    this.currentUser = null
    localStorage.removeItem('demo_token')
    return new DataSuccess(undefined)
  }

  // Groups
  async getAllGroups(): Promise<ApiResult<{ groups: Group[] }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    return new DataSuccess({ groups: [mockGroup] })
  }

  async getGroupById(id: number): Promise<ApiResult<{ group: Group }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    if (id === mockGroup.id) {
      return new DataSuccess({ group: mockGroup })
    }
    
    return new DataError('Groupe non trouvé', 404)
  }

  async createGroup(payload: CreateGroupPayload): Promise<ApiResult<{ group: Group }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const newGroup: Group = {
      id: nextId++,
      nom: payload.nom,
      users: [this.currentUser!],
      tasks: [],
      actions: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return new DataSuccess({ group: newGroup })
  }

  async joinGroup(payload: JoinGroupPayload): Promise<ApiResult<{ group: Group }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    if (payload.groupId === mockGroup.id) {
      return new DataSuccess({ group: mockGroup })
    }
    
    return new DataError('Groupe non trouvé', 404)
  }

  // Tasks
  async getAllTasks(): Promise<ApiResult<{ tasks: Task[] }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    return new DataSuccess({ tasks: mockTasks })
  }

  async getTasksByGroupId(groupId: number): Promise<ApiResult<{ tasks: Task[] }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    if (groupId === mockGroup.id) {
      return new DataSuccess({ tasks: mockTasks })
    }
    
    return new DataSuccess({ tasks: [] })
  }

  async getTaskById(id: number): Promise<ApiResult<{ task: Task }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const task = mockTasks.find(t => t.id === id)
    if (task) {
      return new DataSuccess({ task })
    }
    
    return new DataError('Tâche non trouvée', 404)
  }

  async createTask(payload: CreateTaskPayload): Promise<ApiResult<{ task: Task }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const tag = mockTags.find(t => t.id === payload.tagId)
    
    const newTask: Task = {
      id: nextId++,
      label: payload.label,
      iconUrl: payload.iconUrl,
      frequenceEstimee: payload.frequenceEstimee,
      uniteFrequence: payload.uniteFrequence,
      group: mockGroup,
      tag: tag,
      actions: [],
      userTaskState: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Ajouter la tâche au mock (simulation)
    mockTasks.push(newTask)
    
    return new DataSuccess({ task: newTask })
  }

  async updateTask(id: number, payload: Partial<CreateTaskPayload>): Promise<ApiResult<{ task: Task }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const taskIndex = mockTasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      return new DataError('Tâche non trouvée', 404)
    }
    
    const updatedTask = {
      ...mockTasks[taskIndex],
      ...payload,
      updatedAt: new Date().toISOString()
    }
    
    mockTasks[taskIndex] = updatedTask
    
    return new DataSuccess({ task: updatedTask })
  }

  async deleteTask(id: number): Promise<ApiResult<void>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const taskIndex = mockTasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      return new DataError('Tâche non trouvée', 404)
    }
    
    mockTasks.splice(taskIndex, 1)
    
    return new DataSuccess(undefined)
  }

  // Tags
  async getAllTags(): Promise<ApiResult<{ tags: Tag[] }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    return new DataSuccess({ tags: mockTags })
  }

  async getTagsByGroupId(groupId: number): Promise<ApiResult<{ tags: Tag[] }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    if (groupId === mockGroup.id) {
      return new DataSuccess({ tags: mockTags })
    }
    
    return new DataSuccess({ tags: [] })
  }

  async getTagById(id: number): Promise<ApiResult<{ tag: Tag }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const tag = mockTags.find(t => t.id === id)
    if (tag) {
      return new DataSuccess({ tag })
    }
    
    return new DataError('Tag non trouvé', 404)
  }

  async createTag(payload: CreateTagPayload): Promise<ApiResult<{ tag: Tag }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const newTag: Tag = {
      id: nextId++,
      label: payload.label,
      color: payload.color,
      group: mockGroup,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockTags.push(newTag)
    
    return new DataSuccess({ tag: newTag })
  }

  async updateTag(id: number, payload: Partial<CreateTagPayload>): Promise<ApiResult<{ tag: Tag }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const tagIndex = mockTags.findIndex(t => t.id === id)
    if (tagIndex === -1) {
      return new DataError('Tag non trouvé', 404)
    }
    
    const updatedTag = {
      ...mockTags[tagIndex],
      ...payload,
      updatedAt: new Date().toISOString()
    }
    
    mockTags[tagIndex] = updatedTag
    
    return new DataSuccess({ tag: updatedTag })
  }

  async deleteTag(id: number): Promise<ApiResult<void>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const tagIndex = mockTags.findIndex(t => t.id === id)
    if (tagIndex === -1) {
      return new DataError('Tag non trouvé', 404)
    }
    
    mockTags.splice(tagIndex, 1)
    
    return new DataSuccess(undefined)
  }

  // Actions
  async createAction(payload: CreateActionPayload): Promise<ApiResult<{ action: Action }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const task = mockTasks.find(t => t.id === payload.taskId)
    if (!task) {
      return new DataError('Tâche non trouvée', 404)
    }
    
    const newAction: Action = {
      id: nextId++,
      date: payload.date,
      isHelpingHand: false,
      task: task,
      user: this.currentUser!,
      group: mockGroup,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockActions.push(newAction)
    
    return new DataSuccess({ action: newAction })
  }

  // User Task States
  async updateUserTaskState(taskId: number, payload: UpdateUserTaskStatePayload): Promise<ApiResult<{ userTaskState: UserTaskState }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    let userTaskState = mockUserTaskStates.find(uts => uts.taskId === taskId && uts.userId === this.currentUser!.id)
    
    if (!userTaskState) {
      // Créer un nouvel état si il n'existe pas
      userTaskState = {
        id: nextId++,
        taskId: taskId,
        userId: this.currentUser!.id,
        isAcknowledged: false,
        isConcerned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockUserTaskStates.push(userTaskState)
    }
    
    // Mettre à jour l'état
    if (payload.isAcknowledged !== undefined) {
      userTaskState.isAcknowledged = payload.isAcknowledged
      userTaskState.acknowledgedAt = payload.isAcknowledged ? new Date().toISOString() : undefined
    }
    
    if (payload.isConcerned !== undefined) {
      userTaskState.isConcerned = payload.isConcerned
      userTaskState.concernedAt = payload.isConcerned ? new Date().toISOString() : undefined
    }
    
    userTaskState.updatedAt = new Date().toISOString()
    
    return new DataSuccess({ userTaskState })
  }

  async getUserTaskStates(groupId: number): Promise<ApiResult<{ userTaskStates: UserTaskState[] }>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    return new DataSuccess({ userTaskStates: mockUserTaskStates })
  }

  // Statistics
  async getStatistics(groupId: number): Promise<ApiResult<StatisticsResponse>> {
    await delay()
    if (!this.isAuthenticated) {
      return new DataError('Non autorisé', 401)
    }
    
    const groupActions = mockActions.filter(a => a.group.id === groupId)
    const totalActions = groupActions.length
    
    const actionsByUser: Record<string, number> = {}
    const actionsByTask: Record<string, number> = {}
    
    groupActions.forEach(action => {
      const userName = action.user.nom
      const taskName = action.task.label
      
      actionsByUser[userName] = (actionsByUser[userName] || 0) + 1
      actionsByTask[taskName] = (actionsByTask[taskName] || 0) + 1
    })
    
    return new DataSuccess({
      totalActions,
      actionsByUser,
      actionsByTask
    })
  }
}

export const mockApiClient = new MockApiClient()