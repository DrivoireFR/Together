import { apiClient } from '../api/apiClient'
import type { ApiResult } from '@/shared/types/DataResult'
import type { 
  Group,
  CreateGroupPayload,
  GroupSearchResponse
} from '@/shared/types/api'

export class GroupRepository {
  async getAllGroups(): Promise<ApiResult<Group[]>> {
    return apiClient.get<Group[]>('/groups')
  }

  async getGroupById(id: number): Promise<ApiResult<Group>> {
    return apiClient.get<Group>(`/groups/${id}`)
  }

  async createGroup(payload: CreateGroupPayload): Promise<ApiResult<Group>> {
    return apiClient.post<Group>('/groups', payload)
  }

  async searchGroupsByName(nom: string): Promise<ApiResult<Group[]>> {
    return apiClient.get<Group[]>(`/groups/search/name?nom=${encodeURIComponent(nom)}`)
  }

  async searchGroupsByEmail(email: string): Promise<ApiResult<Group[]>> {
    return apiClient.get<Group[]>(`/groups/search/email?email=${encodeURIComponent(email)}`)
  }

  async joinGroup(groupId: number): Promise<ApiResult<void>> {
    return apiClient.post<void>(`/groups/${groupId}/join`)
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
}

export const groupRepository = new GroupRepository()