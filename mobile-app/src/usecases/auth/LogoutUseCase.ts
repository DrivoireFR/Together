import { UseCase, type UseCaseResult, type NoInput } from '../../core/UseCase';
import { StorageUtil } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

export class LogoutUseCase extends UseCase<NoInput, void> {
  async execute(): Promise<UseCaseResult<void>> {
    await StorageUtil.removeItem(STORAGE_KEYS.TOKEN);
    await StorageUtil.removeItem(STORAGE_KEYS.USER);
    return { success: true, data: undefined };
  }
}
