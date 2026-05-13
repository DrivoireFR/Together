import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IGroupRepository } from '../../core/interfaces/IGroupRepository';
import type { JoinGroupDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

interface JoinGroupInput {
  groupId: number;
  payload: JoinGroupDto;
}

export class JoinGroupUseCase extends UseCase<JoinGroupInput, unknown> {
  constructor(private readonly groupRepo: IGroupRepository) {
    super();
  }

  async execute(input: JoinGroupInput): Promise<UseCaseResult<unknown>> {
    const result = await this.groupRepo.join(input.groupId, input.payload);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
