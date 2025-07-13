import { apiClient } from '../api/apiClient'
import { mockApiClient } from '../mocks/mockApiClient'
import { IS_DEMO_MODE } from '@/shared/constants'
import type { ApiResult } from '@/shared/types/DataResult'
import type { 
  Group,
  CreateGroupPayload,
  GroupSearchResponse
} from '@/shared/types/api'

export class GroupRepository {
  async getAllGroups(): Promise<ApiResult<Group[]>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getAllGroups().then(result => {
        if (result.isSuccess) {
          return { isSuccess: true, data: result.data.groups } as ApiResult<Group[]>
        }
        return result as any
      })
    }
    return apiClient.get<Group[]>('/groups')
  }

  async getGroupById(id: number): Promise<ApiResult<Group>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.getGroupById(id).then(result => {
        if (result.isSuccess) {
          return { isSuccess: true, data: result.data.group } as ApiResult<Group>
        }
        return result as any
      })
    }
    return apiClient.get<Group>(`/groups/${id}`)
  }

  async createGroup(payload: CreateGroupPayload): Promise<ApiResult<Group>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.createGroup(payload).then(result => {
        if (result.isSuccess) {
          return { isSuccess: true, data: result.data.group } as ApiResult<Group>
        }
        return result as any
      })
    }
    return apiClient.post<Group>('/groups', payload)
  }

  async searchGroupsByName(nom: string): Promise<ApiResult<Group[]>> {
    if (IS_DEMO_MODE) {
      // En mode démo, retourner tous les groupes pour la recherche
      return this.getAllGroups()
    }
    return apiClient.get<Group[]>(`/groups/search/name?nom=${encodeURIComponent(nom)}`)
  }

  async searchGroupsByEmail(email: string): Promise<ApiResult<Group[]>> {
    if (IS_DEMO_MODE) {
      // En mode démo, retourner tous les groupes pour la recherche
      return this.getAllGroups()
    }
    return apiClient.get<Group[]>(`/groups/search/email?email=${encodeURIComponent(email)}`)
  }

  async joinGroup(groupId: number): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.joinGroup({ groupId }).then(result => {
        if (result.isSuccess) {
          return { isSuccess: true, data: undefined } as ApiResult<void>
        }
        return result as any
      })
    }
    return apiClient.post<void>(`/groups/${groupId}/join`)
  }

  async leaveGroup(groupId: number): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      // En mode démo, simuler le départ d'un groupe
      return { isSuccess: true, data: undefined } as ApiResult<void>
    }
    return apiClient.post<void>(`/groups/${groupId}/leave`)
  }

  async updateGroup(id: number, payload: Partial<CreateGroupPayload>): Promise<ApiResult<Group>> {
    if (IS_DEMO_MODE) {
      // En mode démo, simuler la mise à jour
      return this.getGroupById(id)
    }
    return apiClient.put<Group>(`/groups/${id}`, payload)
  }

  async deleteGroup(id: number): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      // En mode démo, simuler la suppression
      return { isSuccess: true, data: undefined } as ApiResult<void>
    }
    return apiClient.delete<void>(`/groups/${id}`)
  }
}

export const groupRepository = new GroupRepository()