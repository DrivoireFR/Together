import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IGroupRepository } from '../../core/interfaces/IGroupRepository';
import type { AddTasksDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

interface AddTasksInput {
  groupId: number;
  payload: AddTasksDto;
}

export class AddTasksToGroupUseCase extends UseCase<AddTasksInput, unknown> {
  constructor(private readonly groupRepo: IGroupRepository) {
    super();
  }

  async execute(input: AddTasksInput): Promise<UseCaseResult<unknown>> {
    const result = await this.groupRepo.addTasks(input.groupId, input.payload);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
