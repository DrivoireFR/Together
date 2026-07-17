import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { ITaskRepository } from '../../core/interfaces/ITaskRepository';
import type { CreateTaskDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

export class CreateTaskUseCase extends UseCase<CreateTaskDto, unknown> {
  constructor(private readonly taskRepo: ITaskRepository) {
    super();
  }

  async execute(input: CreateTaskDto): Promise<UseCaseResult<unknown>> {
    const result = await this.taskRepo.create(input);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
