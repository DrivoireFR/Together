import { UseCase, type UseCaseResult, type NoInput } from '../../core/UseCase';
import type { ITaskRepository } from '../../core/interfaces/ITaskRepository';
import { DataSuccess } from '../../utils/DataResult';

export class GetTasksUseCase extends UseCase<NoInput, unknown> {
  constructor(private readonly taskRepo: ITaskRepository) {
    super();
  }

  async execute(): Promise<UseCaseResult<unknown>> {
    const result = await this.taskRepo.getAll();
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
