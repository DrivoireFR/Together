import type { ApiResult } from '../../utils/DataResult';
import type {
  RegisterDto,
  RegisterResponseDto,
  RequestOtpDto,
  RequestOtpResponseDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
  UpdateUserDto,
  UserResponseDto,
} from '../../api/dto';

export interface IAuthRepository {
  register(payload: RegisterDto): Promise<ApiResult<RegisterResponseDto>>;
  requestOtp(payload: RequestOtpDto): Promise<ApiResult<RequestOtpResponseDto>>;
  verifyOtp(payload: VerifyOtpDto): Promise<ApiResult<VerifyOtpResponseDto>>;
  verifyToken(): Promise<ApiResult<void>>;
  getProfile(): Promise<ApiResult<UserResponseDto>>;
  refreshToken(): Promise<ApiResult<{ token: string }>>;
  updateProfile(payload: UpdateUserDto): Promise<ApiResult<UserResponseDto>>;
}
