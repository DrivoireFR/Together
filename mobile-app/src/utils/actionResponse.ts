import type { ActionDetailDto } from '../api/dto';

/**
 * API returns `{ message, actions, total? }` for list/recent endpoints.
 */
export function unwrapActionsFromResponse(data: unknown): ActionDetailDto[] {
  if (Array.isArray(data)) {
    return data as ActionDetailDto[];
  }
  if (data && typeof data === 'object' && 'actions' in data) {
    const actions = (data as { actions?: unknown }).actions;
    if (Array.isArray(actions)) {
      return actions as ActionDetailDto[];
    }
  }
  return [];
}

/**
 * API returns `{ message, action, totalDone? }` for POST `/actions`.
 */
export function unwrapActionFromCreateResponse(
  data: unknown,
): ActionDetailDto | null {
  if (data && typeof data === 'object' && 'action' in data) {
    const action = (data as { action?: unknown }).action;
    if (action && typeof action === 'object' && 'id' in action) {
      return action as ActionDetailDto;
    }
  }
  if (data && typeof data === 'object' && 'id' in data) {
    return data as ActionDetailDto;
  }
  return null;
}
