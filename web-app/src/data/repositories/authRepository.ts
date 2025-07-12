import { apiClient } from '../api/apiClient'
import { mockApiClient } from '../mocks/mockApiClient'
import { IS_DEMO_MODE } from '@/shared/constants'
import type { ApiResult } from '@/shared/types/DataResult'
import type { 
  LoginPayload, 
  RegisterPayload, 
  AuthResponse,
  User
} from '@/shared/types/api'

export class AuthRepository {
  async login(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.login(payload)
    }
    return apiClient.post<AuthResponse>('/auth/login', payload)
  }

  async register(payload: RegisterPayload): Promise<ApiResult<AuthResponse>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.register(payload)
    }
    return apiClient.post<AuthResponse>('/auth/register', payload)
  }

  async getProfile(): Promise<ApiResult<User>> {
    if (IS_DEMO_MODE) {
      // En mode démo, retourner l'utilisateur courant du mock
      const userData = localStorage.getItem('demo_token')
      if (userData) {
        return mockApiClient.login({ email: 'demo@example.com', password: 'demo123' })
          .then(result => {
            if (result.isSuccess) {
              return { isSuccess: true, data: result.data.user } as ApiResult<User>
            }
            return result as any
          })
      }
      return { isSuccess: false, error: 'Non connecté', statusCode: 401 } as any
    }
    return apiClient.get<User>('/users/me')
  }

  async refreshToken(): Promise<ApiResult<AuthResponse>> {
    if (IS_DEMO_MODE) {
      // En mode démo, simuler un refresh token
      return mockApiClient.login({ email: 'demo@example.com', password: 'demo123' })
    }
    return apiClient.post<AuthResponse>('/auth/refresh')
  }

  async rememberMe(): Promise<ApiResult<AuthResponse>> {
    if (IS_DEMO_MODE) {
      // En mode démo, simuler remember me
      return mockApiClient.login({ email: 'demo@example.com', password: 'demo123' })
    }
    return apiClient.get<AuthResponse>('/auth/remember-me')
  }

  async logout(): Promise<ApiResult<void>> {
    if (IS_DEMO_MODE) {
      return mockApiClient.logout()
    }
    return apiClient.post<void>('/auth/logout')
  }
}

export const authRepository = new AuthRepository()