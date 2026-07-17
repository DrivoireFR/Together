import type { ApiResult } from '../../utils/DataResult';
import type { UpdateUserTaskStateDto } from '../../api/dto';

export interface IUserTaskStateRepository {
  update(taskId: number, payload: UpdateUserTaskStateDto): Promise<ApiResult<unknown>>;
  getByGroup(groupId: number): Promise<ApiResult<unknown>>;
}
