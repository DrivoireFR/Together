import { apiClient } from '../api/apiClient';
import type { ApiResult } from '../utils/DataResult';
import type { IGroupRepository } from '../core/interfaces/IGroupRepository';
import type {
  CreateGroupDto,
  JoinGroupDto,
  UpdateGroupDto,
  AddTagsDto,
  AddTasksDto,
} from '../api/dto';

class GroupRepository implements IGroupRepository {
  async getAll(page?: number, limit?: number): Promise<ApiResult<unknown>> {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    return apiClient.get(`/groups${qs ? `?${qs}` : ''}`);
  }

  async getById(id: number): Promise<ApiResult<unknown>> {
    return apiClient.get(`/groups/${id}`);
  }

  async create(payload: CreateGroupDto): Promise<ApiResult<unknown>> {
    return apiClient.post('/groups', payload);
  }

  async update(id: number, payload: UpdateGroupDto): Promise<ApiResult<unknown>> {
    return apiClient.put(`/groups/${id}`, payload);
  }

  async delete(id: number): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/groups/${id}`);
  }

  async search(nom: string, limit?: number): Promise<ApiResult<unknown>> {
    const params = new URLSearchParams({ nom });
    if (limit) params.set('limit', String(limit));
    return apiClient.get(`/groups/search?${params.toString()}`);
  }

  async getHotActions(groupId: number): Promise<ApiResult<unknown>> {
    return apiClient.get(`/groups/${groupId}/hot-actions`);
  }

  async join(groupId: number, payload: JoinGroupDto): Promise<ApiResult<unknown>> {
    return apiClient.post(`/groups/${groupId}/join`, payload);
  }

  async leave(groupId: number): Promise<ApiResult<void>> {
    return apiClient.post<void>(`/groups/${groupId}/leave`);
  }

  async addTags(groupId: number, payload: AddTagsDto): Promise<ApiResult<unknown>> {
    return apiClient.post(`/groups/${groupId}/tags`, payload);
  }

  async addTasks(groupId: number, payload: AddTasksDto): Promise<ApiResult<unknown>> {
    return apiClient.post(`/groups/${groupId}/tasks`, payload);
  }
}

export const groupRepository: IGroupRepository = new GroupRepository();
