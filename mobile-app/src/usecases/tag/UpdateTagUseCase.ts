import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { ITagRepository } from '../../core/interfaces/ITagRepository';
import type { UpdateTagDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

interface UpdateTagInput {
  id: number;
  payload: UpdateTagDto;
}

export class UpdateTagUseCase extends UseCase<UpdateTagInput, unknown> {
  constructor(private readonly tagRepo: ITagRepository) {
    super();
  }

  async execute(input: UpdateTagInput): Promise<UseCaseResult<unknown>> {
    const result = await this.tagRepo.update(input.id, input.payload);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
