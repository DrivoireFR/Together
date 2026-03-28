import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Action, User } from '../../types';
import { AvatarDisplay } from '../atoms/AvatarDisplay';
import { colors, borderRadius, spacing, fontSize } from '../../theme';

interface ActionCardProps {
  action: Action;
  currentUser?: User | null;
  onDelete?: () => void;
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin}min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR');
}

export function ActionCard({ action, currentUser, onDelete }: ActionCardProps) {
  const isOwn = currentUser?.id === action.user.id;

  return (
    <View style={styles.card}>
      <AvatarDisplay
        avatar={action.user.avatar}
        name={action.user.pseudo}
        size={36}
      />
      <View style={styles.content}>
        <Text style={styles.taskLabel} numberOfLines={1}>
          {action.task.label}
        </Text>
        <Text style={styles.meta}>
          {action.user.pseudo} · {timeAgo(action.createdAt)}
          {action.isHelpingHand && ' · 🤝'}
        </Text>
      </View>
      {isOwn && onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  content: { flex: 1 },
  taskLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  deleteButton: { padding: spacing.sm },
  deleteText: {
    fontSize: fontSize.md,
    color: colors.error,
  },
});
