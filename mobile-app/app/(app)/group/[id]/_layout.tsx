import React, { useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useGroupStore } from '../../../../src/stores/groupStore';
import { useTasksStore } from '../../../../src/stores/tasksStore';
import { parseRouteParam } from '../../../../src/utils/routeParams';
import { colors } from '../../../../src/theme';

export default function GroupLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchGroupById } = useGroupStore();
  const { fetchRecentActions, fetchTagsByGroup, setTagFilter } = useTasksStore();

  useEffect(() => {
    const groupId = parseRouteParam(id);
    if (groupId == null) return;

    setTagFilter(null);
    fetchGroupById(groupId);
    fetchRecentActions(groupId);
    fetchTagsByGroup(groupId);
  }, [id]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add" options={{ presentation: 'modal' }} />
      <Stack.Screen name="edit" options={{ presentation: 'modal' }} />
      <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
