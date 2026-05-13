import { UseCase, type UseCaseResult } from '../../core/UseCase';
import type { IAuthRepository } from '../../core/interfaces/IAuthRepository';
import type { RequestOtpDto, RequestOtpResponseDto } from '../../api/dto';
import { DataSuccess } from '../../utils/DataResult';

export class RequestOtpUseCase extends UseCase<RequestOtpDto, RequestOtpResponseDto> {
  constructor(private readonly authRepo: IAuthRepository) {
    super();
  }

  async execute(input: RequestOtpDto): Promise<UseCaseResult<RequestOtpResponseDto>> {
    const result = await this.authRepo.requestOtp(input);
    if (result instanceof DataSuccess) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message, statusCode: result.statusCode };
  }
}
