import { apiClient } from '../api/apiClient'
import type { ApiResult } from '@/shared/types/DataResult'
import type { 
  LoginPayload, 
  RegisterPayload, 
  AuthResponse,
  User
} from '@/shared/types/api'

export class AuthRepository {
  async login(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', payload)
  }

  async register(payload: RegisterPayload): Promise<ApiResult<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', payload)
  }

  async getProfile(): Promise<ApiResult<User>> {
    return apiClient.get<User>('/users/me')
  }

  async refreshToken(): Promise<ApiResult<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/refresh')
  }

  async rememberMe(): Promise<ApiResult<AuthResponse>> {
    return apiClient.get<AuthResponse>('/auth/remember-me')
  }
}

export const authRepository = new AuthRepository()