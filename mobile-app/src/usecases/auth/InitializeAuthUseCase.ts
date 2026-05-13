import { UseCase, type UseCaseResult, type NoInput } from '../../core/UseCase';
import type { IAuthRepository } from '../../core/interfaces/IAuthRepository';
import type { UserResponseDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';
import { StorageUtil } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

export interface InitAuthOutput {
  user: UserResponseDto | null;
  token: string | null;
  isAuthenticated: boolean;
}

export class InitializeAuthUseCase extends UseCase<NoInput, InitAuthOutput> {
  constructor(private readonly authRepo: IAuthRepository) {
    super();
  }

  async execute(): Promise<UseCaseResult<InitAuthOutput>> {
    const token = await StorageUtil.getItem<string>(STORAGE_KEYS.TOKEN);
    const user = await StorageUtil.getItem<UserResponseDto>(STORAGE_KEYS.USER);

    if (!token || !user) {
      return { success: true, data: { user: null, token: null, isAuthenticated: false } };
    }

    const result = await this.authRepo.getProfile();
    if (result instanceof DataSuccess) {
      await StorageUtil.setItem(STORAGE_KEYS.USER, result.data);
      return { success: true, data: { user: result.data, token, isAuthenticated: true } };
    }

    await StorageUtil.removeItem(STORAGE_KEYS.TOKEN);
    await StorageUtil.removeItem(STORAGE_KEYS.USER);
    return { success: true, data: { user: null, token: null, isAuthenticated: false } };
  }
}
