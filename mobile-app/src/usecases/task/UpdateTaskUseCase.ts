import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { ITaskRepository } from '../../core/interfaces/ITaskRepository';
import type { UpdateTaskDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

interface UpdateTaskInput {
  id: number;
  payload: UpdateTaskDto;
}

export class UpdateTaskUseCase extends UseCase<UpdateTaskInput, unknown> {
  constructor(private readonly taskRepo: ITaskRepository) {
    super();
  }

  async execute(input: UpdateTaskInput): Promise<UseCaseResult<unknown>> {
    const result = await this.taskRepo.update(input.id, input.payload);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
