import { apiClient } from '../api/apiClient'
import type { ApiResult } from '@/shared/types/DataResult'
import type {
  Task,
  Tag,
  Action,
  UserTaskState,
  CreateTaskPayload,
  CreateTagPayload,
  CreateActionPayload,
  UpdateUserTaskStatePayload,
  CreateTaskResponse,
  CreateActionResponse,
  GetRecentActionsResponse,
  UpdateTaskResponse,
  UpdateTaskPayload
} from '@/shared/types/api'

export class TaskRepository {
  // Tasks
  async getAllTasks(): Promise<ApiResult<{ tasks: Task[] }>> {
    return apiClient.get<{ tasks: Task[] }>('/tasks')
  }

  async getTasksByGroupId(groupId: number): Promise<ApiResult<{ tasks: Task[] }>> {
    return apiClient.get<{ tasks: Task[] }>(`/tasks/group/${groupId}`)
  }

  async getTaskById(id: number): Promise<ApiResult<{ task: Task }>> {
    return apiClient.get<{ task: Task }>(`/tasks/${id}`)
  }

  async createTask(payload: CreateTaskPayload): Promise<ApiResult<CreateTaskResponse>> {
    return apiClient.post<CreateTaskResponse>('/tasks', payload)
  }

  async updateTask(id: number, payload: UpdateTaskPayload): Promise<ApiResult<UpdateTaskResponse>> {
    return apiClient.put<UpdateTaskResponse>(`/tasks/${id}`, payload)
  }

  async deleteTask(id: number): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/tasks/${id}`)
  }

  // Tags
  async getAllTags(): Promise<ApiResult<{ tags: Tag[] }>> {
    return apiClient.get<{ tags: Tag[] }>('/tags')
  }

  async getTagsByGroupId(groupId: number): Promise<ApiResult<{ tags: Tag[] }>> {
    return apiClient.get<{ tags: Tag[] }>(`/tags/group/${groupId}`)
  }

  async getTagById(id: number): Promise<ApiResult<{ tag: Tag }>> {
    return apiClient.get<{ tag: Tag }>(`/tags/${id}`)
  }

  async createTag(payload: CreateTagPayload): Promise<ApiResult<{ tag: Tag }>> {
    return apiClient.post<{ tag: Tag }>('/tags', payload)
  }

  async updateTag(id: number, payload: Partial<CreateTagPayload>): Promise<ApiResult<{ tag: Tag }>> {
    return apiClient.put<{ tag: Tag }>(`/tags/${id}`, payload)
  }

  async deleteTag(id: number): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/tags/${id}`)
  }

  // Actions
  async createAction(payload: CreateActionPayload): Promise<ApiResult<CreateActionResponse>> {
    return apiClient.post<CreateActionResponse>('/actions', payload)
  }

  async deleteAction(id: number): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/actions/${id}`)
  }

  async getRecentActionsByGroupId(groupId: number): Promise<ApiResult<GetRecentActionsResponse>> {
    return apiClient.get<GetRecentActionsResponse>(`/actions/group/${groupId}/recent`)
  }

  // UserTaskState
  async updateUserTaskState(taskId: number, payload: UpdateUserTaskStatePayload): Promise<ApiResult<{ userTaskState: UserTaskState }>> {
    return apiClient.put<{ userTaskState: UserTaskState }>(`/user-task-states/${taskId}`, payload)
  }

  async getUserTaskStates(groupId: number): Promise<ApiResult<{ userTaskStates: UserTaskState[] }>> {
    return apiClient.get<{ userTaskStates: UserTaskState[] }>(`/user-task-states/group/${groupId}`)
  }
}

export const taskRepository = new TaskRepository()