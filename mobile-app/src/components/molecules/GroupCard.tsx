import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Group, User } from '../../types';
import { AvatarDisplay } from '../atoms/AvatarDisplay';
import { colors, borderRadius, spacing, fontSize } from '../../theme';

interface GroupCardProps {
  group: Group;
  currentUser?: User | null;
  onPress?: () => void;
}

export function GroupCard({ group, currentUser, onPress }: GroupCardProps) {
  const isMember = group.users?.some((u) => u.id === currentUser?.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {group.nom}
        </Text>
        {isMember && (
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>Membre</Text>
          </View>
        )}
      </View>

      <View style={styles.stats}>
        <Text style={styles.stat}>
          {group.users?.length ?? 0} membre{(group.users?.length ?? 0) > 1 ? 's' : ''}
        </Text>
        <Text style={styles.statSeparator}>·</Text>
        <Text style={styles.stat}>
          {group.tasks?.length ?? 0} tâche{(group.tasks?.length ?? 0) > 1 ? 's' : ''}
        </Text>
      </View>

      {group.users && group.users.length > 0 && (
        <View style={styles.members}>
          {group.users.slice(0, 5).map((user) => (
            <AvatarDisplay
              key={user.id}
              avatar={user.avatar}
              name={user.pseudo}
              size={28}
            />
          ))}
          {group.users.length > 5 && (
            <Text style={styles.moreMembers}>
              +{group.users.length - 5}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  memberBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  memberBadgeText: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stat: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statSeparator: {
    marginHorizontal: spacing.xs,
    color: colors.textTertiary,
  },
  members: {
    flexDirection: 'row',
    gap: -spacing.xs,
    alignItems: 'center',
  },
  moreMembers: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});
