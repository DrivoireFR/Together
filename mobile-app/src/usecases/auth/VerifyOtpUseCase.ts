import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IAuthRepository } from '../../core/interfaces/IAuthRepository';
import type { VerifyOtpDto, VerifyOtpResponseDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';
import { StorageUtil } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

export class VerifyOtpUseCase extends UseCase<VerifyOtpDto, VerifyOtpResponseDto> {
  constructor(private readonly authRepo: IAuthRepository) {
    super();
  }

  async execute(input: VerifyOtpDto): Promise<UseCaseResult<VerifyOtpResponseDto>> {
    const result = await this.authRepo.verifyOtp(input);
    if (result instanceof DataSuccess) {
      await StorageUtil.setItem(STORAGE_KEYS.TOKEN, result.data.token);
      await StorageUtil.setItem(STORAGE_KEYS.USER, result.data.user);
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
