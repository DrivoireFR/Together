import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IGroupRepository } from '../../core/interfaces/IGroupRepository';
import { DataSuccess } from '../../utils/DataResult';

export class GetGroupUseCase extends UseCase<number, unknown> {
  constructor(private readonly groupRepo: IGroupRepository) {
    super();
  }

  async execute(groupId: number): Promise<UseCaseResult<unknown>> {
    const result = await this.groupRepo.getById(groupId);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
