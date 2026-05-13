import { UseCase, type UseCaseResult, type NoInput } from '../../core/UseCase';
import type { IAuthRepository } from '../../core/interfaces/IAuthRepository';
import type { UserResponseDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';
import { StorageUtil } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

export class GetProfileUseCase extends UseCase<NoInput, UserResponseDto> {
  constructor(private readonly authRepo: IAuthRepository) {
    super();
  }

  async execute(): Promise<UseCaseResult<UserResponseDto>> {
    const result = await this.authRepo.getProfile();
    if (result instanceof DataSuccess) {
      await StorageUtil.setItem(STORAGE_KEYS.USER, result.data);
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
