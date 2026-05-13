import type { ApiResult } from '../../utils/DataResult';
import type {
  CreateGroupDto,
  JoinGroupDto,
  UpdateGroupDto,
  AddTagsDto,
  AddTasksDto,
} from '../../api/dto';

export interface IGroupRepository {
  getAll(page?: number, limit?: number): Promise<ApiResult<unknown>>;
  getById(id: number): Promise<ApiResult<unknown>>;
  create(payload: CreateGroupDto): Promise<ApiResult<unknown>>;
  update(id: number, payload: UpdateGroupDto): Promise<ApiResult<unknown>>;
  delete(id: number): Promise<ApiResult<void>>;
  search(nom: string, limit?: number): Promise<ApiResult<unknown>>;
  getHotActions(groupId: number): Promise<ApiResult<unknown>>;
  join(groupId: number, payload: JoinGroupDto): Promise<ApiResult<unknown>>;
  leave(groupId: number): Promise<ApiResult<void>>;
  addTags(groupId: number, payload: AddTagsDto): Promise<ApiResult<unknown>>;
  addTasks(groupId: number, payload: AddTasksDto): Promise<ApiResult<unknown>>;
}
