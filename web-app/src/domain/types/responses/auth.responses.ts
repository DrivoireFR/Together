import type { User } from '../entities/user.types'

export interface AuthResponse {
  token: string
  user: User
}

export interface getProfileResponse {
  message: string
  user: User
}