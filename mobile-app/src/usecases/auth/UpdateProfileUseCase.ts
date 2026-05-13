import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IAuthRepository } from '../../core/interfaces/IAuthRepository';
import type { UpdateUserDto, UserResponseDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';
import { StorageUtil } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

export class UpdateProfileUseCase extends UseCase<UpdateUserDto, UserResponseDto> {
  constructor(private readonly authRepo: IAuthRepository) {
    super();
  }

  async execute(input: UpdateUserDto): Promise<UseCaseResult<UserResponseDto>> {
    const result = await this.authRepo.updateProfile(input);
    if (result instanceof DataSuccess) {
      await StorageUtil.setItem(STORAGE_KEYS.USER, result.data);
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
