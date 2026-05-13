import React, { useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useGroupStore } from '../../../../src/stores/groupStore';
import { useTasksStore } from '../../../../src/stores/tasksStore';
import { colors } from '../../../../src/theme';

export default function GroupLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchGroupById, currentGroup } = useGroupStore();
  const { fetchRecentActions, fetchTagsByGroup } = useTasksStore();

  useEffect(() => {
    const groupId = parseInt(id, 10);
    if (!isNaN(groupId)) {
      fetchGroupById(groupId);
      fetchRecentActions(groupId);
      fetchTagsByGroup(groupId);
    }
  }, [id]);

  useEffect(() => {
    if (currentGroup) {
      const { setTasks, setTags } = useTasksStore.getState();
      const tasks = (currentGroup as Record<string, unknown>).tasks;
      const tags = (currentGroup as Record<string, unknown>).tags;
      if (Array.isArray(tasks)) setTasks(tasks);
      if (Array.isArray(tags)) setTags(tags);
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
      <Stack.Screen name="add" options={{ presentation: 'modal' }} />
      <Stack.Screen name="edit" options={{ presentation: 'modal' }} />
      <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
