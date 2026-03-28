import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Task } from '../../types';
import { HurryState } from '../../types';
import { TagChip } from '../atoms/TagChip';
import { colors, borderRadius, spacing, fontSize } from '../../theme';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onAction?: () => void;
  loading?: boolean;
}

const hurryColors: Record<string, string> = {
  [HurryState.YES]: colors.hurryYes,
  [HurryState.MAYBE]: colors.hurryMaybe,
  [HurryState.NO]: colors.hurryNo,
};

export function TaskCard({ task, onPress, onAction, loading }: TaskCardProps) {
  const hurryColor = hurryColors[task.hurryState || HurryState.NO];

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: hurryColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.label} numberOfLines={1}>
            {task.label}
          </Text>
          <Text style={styles.points}>{task.points} pts</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.frequency}>
            {task.frequenceEstimee}x / {task.uniteFrequence}
          </Text>
          {task.tag && (
            <TagChip tag={task.tag} />
          )}
        </View>
      </View>

      {onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>
            {loading ? '...' : "C'est fait !"}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.hurryNo,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  points: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  frequency: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  actionButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  actionText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
});
