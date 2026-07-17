import { apiClient } from '../api/apiClient';
import type { ApiResult } from '../utils/DataResult';
import type { ITagRepository } from '../core/interfaces/ITagRepository';
import type { CreateTagDto, UpdateTagDto } from '../api/dto';

class TagRepository implements ITagRepository {
  async getByGroupId(groupId: number): Promise<ApiResult<unknown>> {
    return apiClient.get(`/tags/group/${groupId}`);
  }

  async getById(id: number): Promise<ApiResult<unknown>> {
    return apiClient.get(`/tags/${id}`);
  }

  async create(payload: CreateTagDto): Promise<ApiResult<unknown>> {
    return apiClient.post('/tags', payload);
  }

  async update(id: number, payload: UpdateTagDto): Promise<ApiResult<unknown>> {
    return apiClient.put(`/tags/${id}`, payload);
  }

  async delete(id: number): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/tags/${id}`);
  }
}

export const tagRepository: ITagRepository = new TagRepository();
