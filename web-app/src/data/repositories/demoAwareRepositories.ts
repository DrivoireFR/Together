import { apiClient } from '../api/apiClient'
import { mockApiClient } from '../mocks/mockApiClient'
import { IS_DEMO_MODE } from '@/shared/constants'
import type { ApiResult } from '@/shared/types/DataResult'
import type { 
  User,
  Group,
  Task,
  Tag,
  Action,
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

// Repository pour l'authentification
export class DemoAwareAuthRepository {
  private client = IS_DEMO_MODE ? mockApiClient : apiClient

  async login(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).login(payload)
    }
    return this.client.post<AuthResponse>('/auth/login', payload)
  }

  async register(payload: RegisterPayload): Promise<ApiResult<AuthResponse>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).register(payload)
    }
    return this.client.post<AuthResponse>('/auth/register', payload)
  }

  async logout(): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).logout()
    }
    return this.client.post<void>('/auth/logout')
  }
}

// Repository pour les groupes
export class DemoAwareGroupRepository {
  private client = IS_DEMO_MODE ? mockApiClient : apiClient

  async getAllGroups(): Promise<ApiResult<{ groups: Group[] }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getAllGroups()
    }
    return this.client.get<{ groups: Group[] }>('/groups')
  }

  async getGroupById(id: number): Promise<ApiResult<{ group: Group }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getGroupById(id)
    }
    return this.client.get<{ group: Group }>(`/groups/${id}`)
  }

  async createGroup(payload: CreateGroupPayload): Promise<ApiResult<{ group: Group }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).createGroup(payload)
    }
    return this.client.post<{ group: Group }>('/groups', payload)
  }

  async joinGroup(payload: JoinGroupPayload): Promise<ApiResult<{ group: Group }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).joinGroup(payload)
    }
    return this.client.post<{ group: Group }>('/groups/join', payload)
  }

  async searchGroups(query: string): Promise<ApiResult<{ groups: Group[] }>> {
    if (IS_DEMO_MODE) {
      // Simuler une recherche dans les mocks
      return (this.client as any).getAllGroups()
    }
    return this.client.get<{ groups: Group[] }>(`/groups/search?q=${encodeURIComponent(query)}`)
  }

  async getStatistics(groupId: number): Promise<ApiResult<StatisticsResponse>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getStatistics(groupId)
    }
    return this.client.get<StatisticsResponse>(`/groups/${groupId}/statistics`)
  }
}

// Repository pour les tâches
export class DemoAwareTaskRepository {
  private client = IS_DEMO_MODE ? mockApiClient : apiClient

  async getAllTasks(): Promise<ApiResult<{ tasks: Task[] }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getAllTasks()
    }
    return this.client.get<{ tasks: Task[] }>('/tasks')
  }

  async getTasksByGroupId(groupId: number): Promise<ApiResult<{ tasks: Task[] }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getTasksByGroupId(groupId)
    }
    return this.client.get<{ tasks: Task[] }>(`/tasks/group/${groupId}`)
  }

  async getTaskById(id: number): Promise<ApiResult<{ task: Task }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getTaskById(id)
    }
    return this.client.get<{ task: Task }>(`/tasks/${id}`)
  }

  async createTask(payload: CreateTaskPayload): Promise<ApiResult<{ task: Task }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).createTask(payload)
    }
    return this.client.post<{ task: Task }>('/tasks', payload)
  }

  async updateTask(id: number, payload: Partial<CreateTaskPayload>): Promise<ApiResult<{ task: Task }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).updateTask(id, payload)
    }
    return this.client.put<{ task: Task }>(`/tasks/${id}`, payload)
  }

  async deleteTask(id: number): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).deleteTask(id)
    }
    return this.client.delete<void>(`/tasks/${id}`)
  }

  // Tags
  async getAllTags(): Promise<ApiResult<{ tags: Tag[] }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getAllTags()
    }
    return this.client.get<{ tags: Tag[] }>('/tags')
  }

  async getTagsByGroupId(groupId: number): Promise<ApiResult<{ tags: Tag[] }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getTagsByGroupId(groupId)
    }
    return this.client.get<{ tags: Tag[] }>(`/tags/group/${groupId}`)
  }

  async getTagById(id: number): Promise<ApiResult<{ tag: Tag }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getTagById(id)
    }
    return this.client.get<{ tag: Tag }>(`/tags/${id}`)
  }

  async createTag(payload: CreateTagPayload): Promise<ApiResult<{ tag: Tag }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).createTag(payload)
    }
    return this.client.post<{ tag: Tag }>('/tags', payload)
  }

  async updateTag(id: number, payload: Partial<CreateTagPayload>): Promise<ApiResult<{ tag: Tag }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).updateTag(id, payload)
    }
    return this.client.put<{ tag: Tag }>(`/tags/${id}`, payload)
  }

  async deleteTag(id: number): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).deleteTag(id)
    }
    return this.client.delete<void>(`/tags/${id}`)
  }

  // Actions
  async createAction(payload: CreateActionPayload): Promise<ApiResult<{ action: Action }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).createAction(payload)
    }
    return this.client.post<{ action: Action }>('/actions', payload)
  }

  // UserTaskState
  async updateUserTaskState(taskId: number, payload: UpdateUserTaskStatePayload): Promise<ApiResult<{ userTaskState: UserTaskState }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).updateUserTaskState(taskId, payload)
    }
    return this.client.put<{ userTaskState: UserTaskState }>(`/user-task-states/${taskId}`, payload)
  }

  async getUserTaskStates(groupId: number): Promise<ApiResult<{ userTaskStates: UserTaskState[] }>> {
    if (IS_DEMO_MODE) {
      return (this.client as any).getUserTaskStates(groupId)
    }
    return this.client.get<{ userTaskStates: UserTaskState[] }>(`/user-task-states/group/${groupId}`)
  }
}

// Instances exportées
export const demoAwareAuthRepository = new DemoAwareAuthRepository()
export const demoAwareGroupRepository = new DemoAwareGroupRepository()
export const demoAwareTaskRepository = new DemoAwareTaskRepository()