import type { User } from '../entities/user.types';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GetProfileResponse {
  message: string;
  user: User;
}
