import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IActionRepository } from '../../core/interfaces/IActionRepository';
import type { CreateActionDto, CreateActionResponseDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

export class CreateActionUseCase extends UseCase<CreateActionDto, CreateActionResponseDto> {
  constructor(private readonly actionRepo: IActionRepository) {
    super();
  }

  async execute(input: CreateActionDto): Promise<UseCaseResult<CreateActionResponseDto>> {
    const result = await this.actionRepo.create(input);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
