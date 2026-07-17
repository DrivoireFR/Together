import type { UserResponseDto } from '../api/dto';

/**
 * API returns `{ message, user }` for GET/PUT `/users/profile`.
 * Older cached sessions may have stored that envelope instead of a flat user.
 */
export function unwrapUserFromProfileResponse(data: unknown): UserResponseDto {
  if (data && typeof data === 'object' && 'user' in data) {
    const nested = (data as { user?: unknown }).user;
    if (nested && typeof nested === 'object' && 'id' in nested) {
      return nested as UserResponseDto;
    }
  }
  return data as UserResponseDto;
}
