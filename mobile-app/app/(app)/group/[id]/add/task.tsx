import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateTaskForm } from '../../../../../src/components/molecules/CreateTaskForm';
import { parseRouteParam } from '../../../../../src/utils/routeParams';
import { colors, spacing, fontSize } from '../../../../../src/theme';

export default function AddTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = parseRouteParam(id) ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle tâche</Text>
      </View>
      <View style={styles.content}>
        <CreateTaskForm
          groupId={groupId}
          onSuccess={() => router.back()}
          onCancel={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  content: { flex: 1, padding: spacing.xl },
});
