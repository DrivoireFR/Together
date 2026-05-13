import type { ApiResult } from '../../utils/DataResult';
import type { CreateTaskDto, UpdateTaskDto } from '../../api/dto';

export interface ITaskRepository {
  getAll(page?: number, limit?: number): Promise<ApiResult<unknown>>;
  getById(id: number, includeActions?: boolean, currentMonthOnly?: boolean): Promise<ApiResult<unknown>>;
  create(payload: CreateTaskDto): Promise<ApiResult<unknown>>;
  update(id: number, payload: UpdateTaskDto): Promise<ApiResult<unknown>>;
  delete(id: number): Promise<ApiResult<void>>;
}
