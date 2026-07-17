import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IGroupRepository } from '../../core/interfaces/IGroupRepository';
import type { AddTagsDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

interface AddTagsInput {
  groupId: number;
  payload: AddTagsDto;
}

export class AddTagsToGroupUseCase extends UseCase<AddTagsInput, unknown> {
  constructor(private readonly groupRepo: IGroupRepository) {
    super();
  }

  async execute(input: AddTagsInput): Promise<UseCaseResult<unknown>> {
    const result = await this.groupRepo.addTags(input.groupId, input.payload);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
