import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { ITagRepository } from '../../core/interfaces/ITagRepository';
import { DataSuccess } from '../../utils/DataResult';

export class DeleteTagUseCase extends UseCase<number, void> {
  constructor(private readonly tagRepo: ITagRepository) {
    super();
  }

  async execute(id: number): Promise<UseCaseResult<void>> {
    const result = await this.tagRepo.delete(id);
    if (result instanceof DataSuccess) {
      return { success: true, data: undefined };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
