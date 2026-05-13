import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IActionRepository } from '../../core/interfaces/IActionRepository';
import { DataSuccess } from '../../utils/DataResult';

export class DeleteActionUseCase extends UseCase<number, void> {
  constructor(private readonly actionRepo: IActionRepository) {
    super();
  }

  async execute(id: number): Promise<UseCaseResult<void>> {
    const result = await this.actionRepo.delete(id);
    if (result instanceof DataSuccess) {
      return { success: true, data: undefined };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
