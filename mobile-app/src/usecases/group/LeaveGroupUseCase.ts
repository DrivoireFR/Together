import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IGroupRepository } from '../../core/interfaces/IGroupRepository';
import { DataSuccess } from '../../utils/DataResult';

export class LeaveGroupUseCase extends UseCase<number, void> {
  constructor(private readonly groupRepo: IGroupRepository) {
    super();
  }

  async execute(groupId: number): Promise<UseCaseResult<void>> {
    const result = await this.groupRepo.leave(groupId);
    if (result instanceof DataSuccess) {
      return { success: true, data: undefined };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
