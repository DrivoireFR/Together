import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStatsStore } from '../../../../../src/stores/statsStore';
import { useGroupStore } from '../../../../../src/stores/groupStore';
import { AvatarDisplay } from '../../../../../src/components/atoms/AvatarDisplay';
import { ProgressBar } from '../../../../../src/components/atoms/ProgressBar';
import { LoadingSpinner } from '../../../../../src/components/atoms/LoadingSpinner';
import { BaseCard } from '../../../../../src/components/atoms/BaseCard';
import { colors, spacing, fontSize } from '../../../../../src/theme';

export default function StatsTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { overview, isLoading, fetchOverview, personalGoals, completionPercentage, totalMonthlyPoints } =
    useStatsStore();
  const { currentGroup } = useGroupStore();

  useEffect(() => {
    const groupId = parseInt(id, 10);
    if (!isNaN(groupId)) fetchOverview(groupId);
  }, [id]);

  if (isLoading) return <LoadingSpinner message="Chargement des stats..." />;

  if (!overview) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.title}>Statistiques</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune donnée disponible</Text>
        </View>
      </SafeAreaView>
    );
  }

  const goals = personalGoals();
  const completion = completionPercentage();
  const monthlyPts = totalMonthlyPoints();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>On en est où ce mois ?</Text>

        <BaseCard style={styles.overviewCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentGroup?.users?.length ?? 0}</Text>
              <Text style={styles.statLabel}>Membres</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{overview.tasks?.length ?? 0}</Text>
              <Text style={styles.statLabel}>Tâches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{overview.totalDone ?? 0}</Text>
              <Text style={styles.statLabel}>Réalisé</Text>
            </View>
          </View>

          <ProgressBar
            progress={completion}
            label="Progression globale"
            detail={`${completion}%`}
            color={colors.primary}
          />
        </BaseCard>

        <Text style={styles.sectionTitle}>Objectifs individuels</Text>

        {goals.map((goal) => {
          const userShare =
            overview.users.length > 0
              ? monthlyPts / overview.users.length
              : 0;
          const userProgress =
            userShare > 0
              ? Math.round((goal.doneThisMonth / userShare) * 100)
              : 0;

          return (
            <BaseCard key={goal.user.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <AvatarDisplay
                  avatar={goal.user.avatar}
                  name={goal.user.pseudo}
                  size={36}
                />
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName}>{goal.user.pseudo}</Text>
                  <Text style={styles.goalDetail}>
                    {goal.doneThisMonth} action{goal.doneThisMonth > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <ProgressBar
                progress={Math.min(userProgress, 100)}
                detail={`${userProgress}%`}
                color={colors.secondary}
              />
            </BaseCard>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  overviewCard: { marginBottom: spacing.xl },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  statItem: { alignItems: 'center' },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  goalCard: { marginBottom: spacing.md },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  goalInfo: { flex: 1 },
  goalName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  goalDetail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
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
