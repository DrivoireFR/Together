import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStatsStore } from '../../../../../src/stores/statsStore';
import { useGroupStore } from '../../../../../src/stores/groupStore';
import { LoadingSpinner } from '../../../../../src/components/atoms/LoadingSpinner';
import { BaseCard } from '../../../../../src/components/atoms/BaseCard';
import { colors, spacing, fontSize } from '../../../../../src/theme';

export default function StatsTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { overview, isLoading, fetchOverview } = useStatsStore();
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

  const totalDone = (overview.totalDone as number) ?? 0;
  const totalVolume = (overview.totalTasksVolume as number) ?? 0;
  const completion = totalVolume > 0 ? Math.round((totalDone / totalVolume) * 100) : 0;

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
              <Text style={styles.statValue}>{totalDone}</Text>
              <Text style={styles.statLabel}>Réalisé</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completion}%</Text>
              <Text style={styles.statLabel}>Progression</Text>
            </View>
          </View>
        </BaseCard>
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
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
