import type { ApiResult } from '../../utils/DataResult';
import type { CreateActionDto, CreateActionResponseDto, UpdateActionDto, ActionDetailDto } from '../../api/dto';

export interface IActionRepository {
  create(payload: CreateActionDto): Promise<ApiResult<CreateActionResponseDto>>;
  getAll(page?: number, limit?: number, currentMonthOnly?: boolean): Promise<ApiResult<ActionDetailDto[]>>;
  getMine(params?: { page?: number; limit?: number; startDate?: string; endDate?: string; fullHistory?: boolean }): Promise<ApiResult<ActionDetailDto[]>>;
  getByUser(userId: number, params?: { page?: number; limit?: number }): Promise<ApiResult<ActionDetailDto[]>>;
  getByGroup(groupId: number, params?: { page?: number; limit?: number }): Promise<ApiResult<ActionDetailDto[]>>;
  getRecentByGroup(groupId: number): Promise<ApiResult<ActionDetailDto[]>>;
  getByTask(taskId: number, params?: { page?: number; limit?: number }): Promise<ApiResult<ActionDetailDto[]>>;
  getById(id: number): Promise<ApiResult<ActionDetailDto>>;
  update(id: number, payload: UpdateActionDto): Promise<ApiResult<unknown>>;
  delete(id: number): Promise<ApiResult<void>>;
}
