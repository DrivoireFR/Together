import { apiClient } from '../api/apiClient';
import type { ApiResult } from '../utils/DataResult';
import type { IStatsRepository } from '../core/interfaces/IStatsRepository';

class StatsRepository implements IStatsRepository {
  async getOverview(groupId: number): Promise<ApiResult<unknown>> {
    return apiClient.get(`/stats/group/${groupId}/overview`);
  }
}

export const statsRepository: IStatsRepository = new StatsRepository();
