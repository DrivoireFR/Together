import { SetMetadata } from '@nestjs/common';

export const TIMEOUT_KEY = 'timeout';

/**
 * Decorator to set a custom timeout for an endpoint
 * @param milliseconds - Timeout in milliseconds (default: 3000ms for standard, 10000ms for heavy endpoints)
 */
export const Timeout = (milliseconds: number) =>
  SetMetadata(TIMEOUT_KEY, milliseconds);

/**
 * Predefined timeout values for common use cases
 */
export const TimeoutValues = {
  STANDARD: 3000, // 3 seconds - for standard endpoints
  HEAVY: 10000, // 10 seconds - for stats, groups with relations
  LIGHT: 1000, // 1 second - for simple health checks
} as const;
