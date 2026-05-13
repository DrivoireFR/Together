import type { Href } from 'expo-router';

/** Default app landing after login / cold start when user has no group. */
export function getPostAuthAppHref(groupId: number | null | undefined): Href {
  if (groupId != null) {
    return `/(app)/group/${groupId}/(tabs)` as Href;
  }
  return '/(app)/groups';
}
