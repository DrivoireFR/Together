import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IGroupRepository } from '../../core/interfaces/IGroupRepository';
import { DataSuccess } from '../../utils/DataResult';

export class SearchGroupsUseCase extends UseCase<string, unknown> {
  constructor(private readonly groupRepo: IGroupRepository) {
    super();
  }

  async execute(nom: string): Promise<UseCaseResult<unknown>> {
    const result = await this.groupRepo.search(nom);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
