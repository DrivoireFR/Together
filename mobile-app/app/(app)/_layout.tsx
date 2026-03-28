import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="groups" />
      <Stack.Screen name="group/[id]" />
    </Stack>
  );
}
