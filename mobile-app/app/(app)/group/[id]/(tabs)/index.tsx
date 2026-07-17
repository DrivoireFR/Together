import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroupStore } from '../../../../../src/stores/groupStore';
import { useTasksStore } from '../../../../../src/stores/tasksStore';
import { useAuthStore } from '../../../../../src/stores/authStore';
import { TagFilter } from '../../../../../src/components/molecules/TagFilter';
import { TaskCard } from '../../../../../src/components/molecules/TaskCard';
import { AvatarDisplay } from '../../../../../src/components/atoms/AvatarDisplay';
import { LoadingSpinner } from '../../../../../src/components/atoms/LoadingSpinner';
import { parseRouteParam } from '../../../../../src/utils/routeParams';
import { colors, spacing, fontSize, borderRadius } from '../../../../../src/theme';

export default function TasksTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = parseRouteParam(id);
  const { currentGroup, isLoading, refreshGroupById } = useGroupStore();
  const { user } = useAuthStore();
  const allTasks = useTasksStore((state) => state.tasks);
  const selectedTagFilter = useTasksStore((state) => state.selectedTagFilter);
  const tasks = useMemo(() => {
    if (!selectedTagFilter) return allTasks;
    return allTasks.filter((task) => task.tag?.id === selectedTagFilter.id);
  }, [allTasks, selectedTagFilter]);
  const tags = useTasksStore((state) => state.tags);
  const createAction = useTasksStore((state) => state.createAction);
  const loadingTaskIds = useTasksStore((state) => state.loadingTaskIds);

  useFocusEffect(
    useCallback(() => {
      if (groupId != null) {
        refreshGroupById(groupId);
      }
    }, [groupId, refreshGroupById]),
  );

  if (isLoading || !currentGroup) {
    return <LoadingSpinner message="Chargement du groupe..." />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.groupName} numberOfLines={1}>
            {currentGroup.nom}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/(app)/group/${id}/profile`)}
        >
          <AvatarDisplay
            avatar={user?.avatar}
            name={user?.pseudo}
            size={36}
          />
        </TouchableOpacity>
      </View>

      <TagFilter tags={tags} />

      <View style={styles.taskHeader}>
        <Text style={styles.taskCount}>
          {tasks.length} tâche{tasks.length !== 1 ? 's' : ''}
          {selectedTagFilter ? ` · ${selectedTagFilter.label}` : ''}
        </Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            loading={loadingTaskIds.has(item.id)}
            onPress={() =>
              router.push(`/(app)/group/${id}/edit/task?taskId=${item.id}`)
            }
            onAction={() =>
              createAction({
                taskId: item.id,
                date: new Date().toISOString().split('T')[0],
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune tâche pour le moment</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez votre première tâche avec le bouton ci-dessous
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/(app)/group/${id}/add/`)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerLeft: { flex: 1, marginRight: spacing.md },
  groupName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  taskHeader: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  taskCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: colors.white,
    fontWeight: '300',
    lineHeight: 30,
  },
});
