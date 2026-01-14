import { apiClient } from '../api/apiClient'
import type { ApiResult } from '@/shared/types/DataResult'
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ForgotPasswordPayload,
  ChangePasswordPayload,
  AuthResponse,
  User,
  getProfileResponse
} from '@/domain/types'

export class AuthRepository {
  async login(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', payload)
  }

  async register(payload: RegisterPayload): Promise<ApiResult<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', payload)
  }

  async getProfile(): Promise<ApiResult<getProfileResponse>> {
    return apiClient.get<getProfileResponse>('/auth/profile')
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResult<{ message: string; user: User }>> {
    return apiClient.put<{ message: string; user: User }>('/users/profile', payload)
  }

  async refreshToken(): Promise<ApiResult<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/refresh')
  }

  async rememberMe(): Promise<ApiResult<AuthResponse>> {
    return apiClient.get<AuthResponse>('/auth/remember-me')
  }

  async confirmEmail(token: string, email: string): Promise<ApiResult<{ message: string; user: User }>> {
    const encodedEmail = encodeURIComponent(email)
    return apiClient.get<{ message: string; user: User }>(`/auth/confirm-email?token=${token}&email=${encodedEmail}`)
  }

  async resendConfirmation(email: string): Promise<ApiResult<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/resend-confirmation', { email })
  }

  async requestPasswordReset(payload: ForgotPasswordPayload): Promise<ApiResult<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', payload)
  }

  async changePassword(payload: ChangePasswordPayload): Promise<ApiResult<{ message: string }>> {
    return apiClient.put<{ message: string }>('/auth/change-password', payload)
  }
}

export const authRepository = new AuthRepository()