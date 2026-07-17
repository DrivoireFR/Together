import { apiClient } from '../api/apiClient';
import type { ApiResult } from '../utils/DataResult';
import type { ITaskRepository } from '../core/interfaces/ITaskRepository';
import type { CreateTaskDto, UpdateTaskDto } from '../api/dto';

class TaskRepository implements ITaskRepository {
  async getAll(page?: number, limit?: number): Promise<ApiResult<unknown>> {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    return apiClient.get(`/tasks${qs ? `?${qs}` : ''}`);
  }

  async getById(
    id: number,
    includeActions?: boolean,
    currentMonthOnly?: boolean,
  ): Promise<ApiResult<unknown>> {
    const params = new URLSearchParams();
    if (includeActions) params.set('includeActions', 'true');
    if (currentMonthOnly) params.set('currentMonthOnly', 'true');
    const qs = params.toString();
    return apiClient.get(`/tasks/${id}${qs ? `?${qs}` : ''}`);
  }

  async create(payload: CreateTaskDto): Promise<ApiResult<unknown>> {
    return apiClient.post('/tasks', payload);
  }

  async update(id: number, payload: UpdateTaskDto): Promise<ApiResult<unknown>> {
    return apiClient.put(`/tasks/${id}`, payload);
  }

  async delete(id: number): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/tasks/${id}`);
  }
}

export const taskRepository: ITaskRepository = new TaskRepository();
