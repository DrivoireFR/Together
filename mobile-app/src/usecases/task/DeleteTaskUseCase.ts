import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { ITaskRepository } from '../../core/interfaces/ITaskRepository';
import { DataSuccess } from '../../utils/DataResult';

export class DeleteTaskUseCase extends UseCase<number, void> {
  constructor(private readonly taskRepo: ITaskRepository) {
    super();
  }

  async execute(id: number): Promise<UseCaseResult<void>> {
    const result = await this.taskRepo.delete(id);
    if (result instanceof DataSuccess) {
      return { success: true, data: undefined };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
