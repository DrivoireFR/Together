import type { GroupData } from '../stores/groupStore';

/**
 * API returns `{ message, group, hotActions? }` for GET `/groups/:id`
 * and `{ message, group, starterPack? }` for POST `/groups`.
 */
export function unwrapGroupFromResponse(data: unknown): GroupData {
  if (data && typeof data === 'object' && 'group' in data) {
    const nested = (data as { group?: unknown }).group;
    if (nested && typeof nested === 'object' && 'id' in nested) {
      return nested as GroupData;
    }
  }
  return data as GroupData;
}
