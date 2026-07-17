import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IActionRepository } from '../../core/interfaces/IActionRepository';
import type { ActionDetailDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

export class GetRecentActionsUseCase extends UseCase<number, ActionDetailDto[]> {
  constructor(private readonly actionRepo: IActionRepository) {
    super();
  }

  async execute(groupId: number): Promise<UseCaseResult<ActionDetailDto[]>> {
    const result = await this.actionRepo.getRecentByGroup(groupId);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
