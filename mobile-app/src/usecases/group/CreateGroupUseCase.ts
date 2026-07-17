import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IGroupRepository } from '../../core/interfaces/IGroupRepository';
import type { CreateGroupDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

export class CreateGroupUseCase extends UseCase<CreateGroupDto, unknown> {
  constructor(private readonly groupRepo: IGroupRepository) {
    super();
  }

  async execute(input: CreateGroupDto): Promise<UseCaseResult<unknown>> {
    const result = await this.groupRepo.create(input);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
