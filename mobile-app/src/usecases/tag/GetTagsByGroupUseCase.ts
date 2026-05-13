import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { ITagRepository } from '../../core/interfaces/ITagRepository';
import { DataSuccess } from '../../utils/DataResult';

export class GetTagsByGroupUseCase extends UseCase<number, unknown> {
  constructor(private readonly tagRepo: ITagRepository) {
    super();
  }

  async execute(groupId: number): Promise<UseCaseResult<unknown>> {
    const result = await this.tagRepo.getByGroupId(groupId);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
