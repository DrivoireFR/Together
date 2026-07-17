import type { ApiResult } from '../../utils/DataResult';

export interface IStatsRepository {
  getOverview(groupId: number): Promise<ApiResult<unknown>>;
}
