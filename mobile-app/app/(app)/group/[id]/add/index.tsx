import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, borderRadius } from '../../../../../src/theme';

export default function AddSelectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push(`/(app)/group/${id}/add/task`)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionIcon}>📝</Text>
          <Text style={styles.optionTitle}>Nouvelle tâche</Text>
          <Text style={styles.optionDescription}>
            Ajoutez une tâche à effectuer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push(`/(app)/group/${id}/add/tag`)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionIcon}>🏷️</Text>
          <Text style={styles.optionTitle}>Nouvelle catégorie</Text>
          <Text style={styles.optionDescription}>
            Organisez vos tâches par catégorie
          </Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  option: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionIcon: { fontSize: 48, marginBottom: spacing.md },
  optionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  optionDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
