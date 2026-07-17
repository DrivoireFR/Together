import type { ApiResult } from '../../utils/DataResult';
import type { CreateTagDto, UpdateTagDto } from '../../api/dto';

export interface ITagRepository {
  getByGroupId(groupId: number): Promise<ApiResult<unknown>>;
  getById(id: number): Promise<ApiResult<unknown>>;
  create(payload: CreateTagDto): Promise<ApiResult<unknown>>;
  update(id: number, payload: UpdateTagDto): Promise<ApiResult<unknown>>;
  delete(id: number): Promise<ApiResult<void>>;
}
