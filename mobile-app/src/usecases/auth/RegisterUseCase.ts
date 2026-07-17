import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IAuthRepository } from '../../core/interfaces/IAuthRepository';
import type { RegisterDto, RegisterResponseDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

export class RegisterUseCase extends UseCase<RegisterDto, RegisterResponseDto> {
  constructor(private readonly authRepo: IAuthRepository) {
    super();
  }

  async execute(input: RegisterDto): Promise<UseCaseResult<RegisterResponseDto>> {
    const result = await this.authRepo.register(input);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
