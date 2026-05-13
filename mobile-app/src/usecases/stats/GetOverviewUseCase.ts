import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IStatsRepository } from '../../core/interfaces/IStatsRepository';
import { DataSuccess } from '../../utils/DataResult';

export class GetOverviewUseCase extends UseCase<number, unknown> {
  constructor(private readonly statsRepo: IStatsRepository) {
    super();
  }

  async execute(groupId: number): Promise<UseCaseResult<unknown>> {
    const result = await this.statsRepo.getOverview(groupId);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
