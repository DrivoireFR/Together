import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IGroupRepository } from '../../core/interfaces/IGroupRepository';
import type { UpdateGroupDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

interface UpdateGroupInput {
  id: number;
  payload: UpdateGroupDto;
}

export class UpdateGroupUseCase extends UseCase<UpdateGroupInput, unknown> {
  constructor(private readonly groupRepo: IGroupRepository) {
    super();
  }

  async execute(input: UpdateGroupInput): Promise<UseCaseResult<unknown>> {
    const result = await this.groupRepo.update(input.id, input.payload);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
