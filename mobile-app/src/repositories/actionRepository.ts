import { apiClient } from '../api/apiClient';
import type { ApiResult } from '../utils/DataResult';
import type { IActionRepository } from '../core/interfaces/IActionRepository';
import type {
  CreateActionDto,
  CreateActionResponseDto,
  UpdateActionDto,
  ActionDetailDto,
} from '../api/dto';

class ActionRepository implements IActionRepository {
  async create(payload: CreateActionDto): Promise<ApiResult<CreateActionResponseDto>> {
    return apiClient.post<CreateActionResponseDto>('/actions', payload);
  }

  async getAll(page?: number, limit?: number, currentMonthOnly?: boolean): Promise<ApiResult<ActionDetailDto[]>> {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (currentMonthOnly) params.set('currentMonthOnly', 'true');
    const qs = params.toString();
    return apiClient.get<ActionDetailDto[]>(`/actions${qs ? `?${qs}` : ''}`);
  }

  async getMine(params?: { page?: number; limit?: number; startDate?: string; endDate?: string; fullHistory?: boolean }): Promise<ApiResult<ActionDetailDto[]>> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.startDate) qs.set('startDate', params.startDate);
    if (params?.endDate) qs.set('endDate', params.endDate);
    if (params?.fullHistory) qs.set('fullHistory', 'true');
    const query = qs.toString();
    return apiClient.get<ActionDetailDto[]>(`/actions/me${query ? `?${query}` : ''}`);
  }

  async getByUser(userId: number, params?: { page?: number; limit?: number }): Promise<ApiResult<ActionDetailDto[]>> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    const query = qs.toString();
    return apiClient.get<ActionDetailDto[]>(`/actions/user/${userId}${query ? `?${query}` : ''}`);
  }

  async getByGroup(groupId: number, params?: { page?: number; limit?: number }): Promise<ApiResult<ActionDetailDto[]>> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    const query = qs.toString();
    return apiClient.get<ActionDetailDto[]>(`/actions/group/${groupId}${query ? `?${query}` : ''}`);
  }

  async getRecentByGroup(groupId: number): Promise<ApiResult<ActionDetailDto[]>> {
    return apiClient.get<ActionDetailDto[]>(`/actions/group/${groupId}/recent`);
  }

  async getByTask(taskId: number, params?: { page?: number; limit?: number }): Promise<ApiResult<ActionDetailDto[]>> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    const query = qs.toString();
    return apiClient.get<ActionDetailDto[]>(`/actions/task/${taskId}${query ? `?${query}` : ''}`);
  }

  async getById(id: number): Promise<ApiResult<ActionDetailDto>> {
    return apiClient.get<ActionDetailDto>(`/actions/${id}`);
  }

  async update(id: number, payload: UpdateActionDto): Promise<ApiResult<unknown>> {
    return apiClient.put(`/actions/${id}`, payload);
  }

  async delete(id: number): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/actions/${id}`);
  }
}

export const actionRepository: IActionRepository = new ActionRepository();
