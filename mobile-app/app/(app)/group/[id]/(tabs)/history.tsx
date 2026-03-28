import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasksStore } from '../../../../../src/stores/tasksStore';
import { useAuthStore } from '../../../../../src/stores/authStore';
import { ActionCard } from '../../../../../src/components/molecules/ActionCard';
import { colors, spacing, fontSize } from '../../../../../src/theme';

export default function HistoryTab() {
  const { actions, deleteAction } = useTasksStore();
  const { user } = useAuthStore();

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
