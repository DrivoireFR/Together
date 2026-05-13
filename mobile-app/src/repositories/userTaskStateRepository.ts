import { apiClient } from '../api/apiClient';
import type { ApiResult } from '../utils/DataResult';
import type { IUserTaskStateRepository } from '../core/interfaces/IUserTaskStateRepository';
import type { UpdateUserTaskStateDto } from '../api/dto';

class UserTaskStateRepository implements IUserTaskStateRepository {
  async update(taskId: number, payload: UpdateUserTaskStateDto): Promise<ApiResult<unknown>> {
    return apiClient.put(`/user-task-states/${taskId}`, payload);
  }

  async getByGroup(groupId: number): Promise<ApiResult<unknown>> {
    return apiClient.get(`/user-task-states/group/${groupId}`);
  }
}

export const userTaskStateRepository: IUserTaskStateRepository = new UserTaskStateRepository();
