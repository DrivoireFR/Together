import { apiClient } from '../api/apiClient';
import type { ApiResult } from '../utils/DataResult';
import { DataSuccess } from '../utils/DataResult';
import { unwrapUserFromProfileResponse } from '../utils/userProfileResponse';
import type { IAuthRepository } from '../core/interfaces/IAuthRepository';
import type {
  RegisterDto,
  RegisterResponseDto,
  RequestOtpDto,
  RequestOtpResponseDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
  UpdateUserDto,
  UserResponseDto,
} from '../api/dto';

class AuthRepository implements IAuthRepository {
  async register(payload: RegisterDto): Promise<ApiResult<RegisterResponseDto>> {
    return apiClient.post<RegisterResponseDto>('/auth/register', payload);
  }

  async requestOtp(payload: RequestOtpDto): Promise<ApiResult<RequestOtpResponseDto>> {
    return apiClient.post<RequestOtpResponseDto>('/auth/request-otp', payload);
  }

  async verifyOtp(payload: VerifyOtpDto): Promise<ApiResult<VerifyOtpResponseDto>> {
    return apiClient.post<VerifyOtpResponseDto>('/auth/verify-otp', payload);
  }

  async verifyToken(): Promise<ApiResult<void>> {
    return apiClient.get<void>('/auth/verify');
  }

  async getProfile(): Promise<ApiResult<UserResponseDto>> {
    const result = await apiClient.get<unknown>('/users/profile');
    if (result instanceof DataSuccess) {
      return new DataSuccess(unwrapUserFromProfileResponse(result.data));
    }
    return result;
  }

  async refreshToken(): Promise<ApiResult<{ token: string }>> {
    return apiClient.post<{ token: string }>('/auth/refresh');
  }

  async updateProfile(payload: UpdateUserDto): Promise<ApiResult<UserResponseDto>> {
    const result = await apiClient.put<unknown>('/users/profile', payload);
    if (result instanceof DataSuccess) {
      return new DataSuccess(unwrapUserFromProfileResponse(result.data));
    }
    return result;
  }
}

export const authRepository: IAuthRepository = new AuthRepository();
