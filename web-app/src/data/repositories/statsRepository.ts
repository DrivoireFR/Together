import { apiClient } from '../api/apiClient'
import type { ApiResult } from '@/shared/types/DataResult'
import type {
    GetOverviewResponse
} from '@/domain/types'

export class StatsRepository {
    async getOverview(groupId: number): Promise<ApiResult<GetOverviewResponse>> {
        return apiClient.get<GetOverviewResponse>(`/stats/group/${groupId}/overview`)
    }
}

export const statsRepository = new StatsRepository()