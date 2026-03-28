import React, { useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useGroupStore } from '../../../../src/stores/groupStore';
import { useTasksStore } from '../../../../src/stores/tasksStore';
import { colors } from '../../../../src/theme';

export default function GroupLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchGroupById, currentGroup } = useGroupStore();
  const { fetchRecentActionsByGroupId, fetchPendingActionAcknowledgment } =
    useTasksStore();

  useEffect(() => {
    const groupId = parseInt(id, 10);
    if (!isNaN(groupId)) {
      fetchGroupById(groupId);
      fetchRecentActionsByGroupId(groupId);
      fetchPendingActionAcknowledgment();
    }
  }, [id]);

  useEffect(() => {
    if (currentGroup) {
      const { setTasks, setTags } = useTasksStore.getState();
      setTasks(currentGroup.tasks ?? []);
      setTags(currentGroup.tags ?? []);
    }
  }, [currentGroup]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="edit"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="settings"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="profile"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}
