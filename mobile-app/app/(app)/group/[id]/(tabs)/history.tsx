import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasksStore } from '../../../../../src/stores/tasksStore';
import { useAuthStore } from '../../../../../src/stores/authStore';
import { ActionCard } from '../../../../../src/components/molecules/ActionCard';
import { parseRouteParam } from '../../../../../src/utils/routeParams';
import { colors, spacing, fontSize } from '../../../../../src/theme';

export default function HistoryTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = parseRouteParam(id);
  const actions = useTasksStore((state) => state.actions);
  const fetchRecentActions = useTasksStore((state) => state.fetchRecentActions);
  const deleteAction = useTasksStore((state) => state.deleteAction);
  const { user } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      if (groupId != null) {
        fetchRecentActions(groupId);
      }
    }, [groupId, fetchRecentActions]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Historique</Text>

      <FlatList
        data={actions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ActionCard
            action={item}
            currentUser={user}
            onDelete={() => deleteAction(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune action récente</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
