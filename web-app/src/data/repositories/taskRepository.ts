import { apiClient } from '../api/apiClient'
import { mockApiClient } from '../mocks/mockApiClient'
import { IS_DEMO_MODE } from '@/shared/constants'
import type { ApiResult } from '@/shared/types/DataResult'
import type { 
  Task,
  Tag,
  Action,
  UserTaskState,
  CreateTaskPayload,
  CreateTagPayload,
  CreateActionPayload,
  UpdateUserTaskStatePayload
} from '@/shared/types/api'

export class TaskRepository {
  // Tasks
  async getAllTasks(): Promise<ApiResult<{ tasks: Task[] }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getAllTasks()
    }
    return apiClient.get<{ tasks: Task[] }>('/tasks')
  }

  async getTasksByGroupId(groupId: number): Promise<ApiResult<{ tasks: Task[] }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getTasksByGroupId(groupId)
    }
    return apiClient.get<{ tasks: Task[] }>(`/tasks/group/${groupId}`)
  }

  async getTaskById(id: number): Promise<ApiResult<{ task: Task }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getTaskById(id)
    }
    return apiClient.get<{ task: Task }>(`/tasks/${id}`)
  }

  async createTask(payload: CreateTaskPayload): Promise<ApiResult<{ task: Task }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.createTask(payload)
    }
    return apiClient.post<{ task: Task }>('/tasks', payload)
  }

  async updateTask(id: number, payload: Partial<CreateTaskPayload>): Promise<ApiResult<{ task: Task }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.updateTask(id, payload)
    }
    return apiClient.put<{ task: Task }>(`/tasks/${id}`, payload)
  }

  async deleteTask(id: number): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.deleteTask(id)
    }
    return apiClient.delete<void>(`/tasks/${id}`)
  }

  // Tags
  async getAllTags(): Promise<ApiResult<{ tags: Tag[] }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getAllTags()
    }
    return apiClient.get<{ tags: Tag[] }>('/tags')
  }

  async getTagsByGroupId(groupId: number): Promise<ApiResult<{ tags: Tag[] }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getTagsByGroupId(groupId)
    }
    return apiClient.get<{ tags: Tag[] }>(`/tags/group/${groupId}`)
  }

  async getTagById(id: number): Promise<ApiResult<{ tag: Tag }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getTagById(id)
    }
    return apiClient.get<{ tag: Tag }>(`/tags/${id}`)
  }

  async createTag(payload: CreateTagPayload): Promise<ApiResult<{ tag: Tag }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.createTag(payload)
    }
    return apiClient.post<{ tag: Tag }>('/tags', payload)
  }

  async updateTag(id: number, payload: Partial<CreateTagPayload>): Promise<ApiResult<{ tag: Tag }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.updateTag(id, payload)
    }
    return apiClient.put<{ tag: Tag }>(`/tags/${id}`, payload)
  }

  async deleteTag(id: number): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.deleteTag(id)
    }
    return apiClient.delete<void>(`/tags/${id}`)
  }

  // Actions
  async createAction(payload: CreateActionPayload): Promise<ApiResult<{ action: Action }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.createAction(payload)
    }
    return apiClient.post<{ action: Action }>('/actions', payload)
  }

  // UserTaskState
  async updateUserTaskState(taskId: number, payload: UpdateUserTaskStatePayload): Promise<ApiResult<{ userTaskState: UserTaskState }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.updateUserTaskState(taskId, payload)
    }
    return apiClient.put<{ userTaskState: UserTaskState }>(`/user-task-states/${taskId}`, payload)
  }

  async getUserTaskStates(groupId: number): Promise<ApiResult<{ userTaskStates: UserTaskState[] }>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getUserTaskStates(groupId)
    }
    return apiClient.get<{ userTaskStates: UserTaskState[] }>(`/user-task-states/group/${groupId}`)
  }
}

export const taskRepository = new TaskRepository()