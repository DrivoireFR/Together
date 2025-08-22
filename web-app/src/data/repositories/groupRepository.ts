import { apiClient } from '../api/apiClient'
import { DataSuccess, DataError, type ApiResult } from '@/shared/types/DataResult'
import type {
  Group,
  CreateGroupPayload,
  GroupSearchResponse,
  UserGroupResponse,
  CreateGroupResponse,
  FetchGroupResponse,
  JoinGroupPayload,
  CreateBulkTagsPayload,
  CreateBulkTasksPayload,
  CreateBulkTagsResponse,
  CreateBulkTasksResponse
} from '@/domain/types'

export class GroupRepository {
  async getAllGroups(): Promise<ApiResult<Group[]>> {
    return apiClient.get<Group[]>('/groups')
  }

  async getGroupById(id: number): Promise<ApiResult<FetchGroupResponse>> {
    return apiClient.get<FetchGroupResponse>(`/groups/${id}`)
  }

  async createGroup(payload: CreateGroupPayload): Promise<ApiResult<CreateGroupResponse>> {
    return apiClient.post<CreateGroupResponse>('/groups', payload)
  }

  async searchGroupsByName(nom: string): Promise<ApiResult<GroupSearchResponse>> {
    return apiClient.get<GroupSearchResponse>(`/groups/search/name?nom=${encodeURIComponent(nom)}`)
  }

  async getUserGroups(userId: number): Promise<ApiResult<UserGroupResponse>> {
    return apiClient.get<UserGroupResponse>(`/groups/user/${userId}`)
  }

  async searchGroupsByEmail(email: string): Promise<ApiResult<Group[]>> {
    return apiClient.get<Group[]>(`/groups/search/email?email=${encodeURIComponent(email)}`)
  }

  async joinGroup(payload: JoinGroupPayload): Promise<ApiResult<void>> {
    return apiClient.post<void>(`/groups/${payload.groupId}/join`, { code: payload.code })
  }

  async leaveGroup(groupId: number): Promise<ApiResult<void>> {
    return apiClient.post<void>(`/groups/${groupId}/leave`)
  }

  async updateGroup(id: number, payload: Partial<CreateGroupPayload>): Promise<ApiResult<Group>> {
    return apiClient.put<Group>(`/groups/${id}`, payload)
  }

  async deleteGroup(id: number): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/groups/${id}`)
  }

  async createBulkTags(groupId: number, payload: CreateBulkTagsPayload): Promise<ApiResult<CreateBulkTagsResponse>> {
    return apiClient.post<CreateBulkTagsResponse>(`/groups/${groupId}/tags`, payload)
  }

  async createBulkTasks(groupId: number, payload: CreateBulkTasksPayload): Promise<ApiResult<CreateBulkTasksResponse>> {
    return apiClient.post<CreateBulkTasksResponse>(`/groups/${groupId}/tasks`, payload)
  }
}

export const groupRepository = new GroupRepository()