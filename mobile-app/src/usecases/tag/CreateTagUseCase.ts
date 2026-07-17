import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { ITagRepository } from '../../core/interfaces/ITagRepository';
import type { CreateTagDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

export class CreateTagUseCase extends UseCase<CreateTagDto, unknown> {
  constructor(private readonly tagRepo: ITagRepository) {
    super();
  }

  async execute(input: CreateTagDto): Promise<UseCaseResult<unknown>> {
    const result = await this.tagRepo.create(input);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
