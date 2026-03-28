import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, fontSize } from '../../theme';

interface ProgressBarProps {
  progress: number;
  label?: string;
  detail?: string;
  color?: string;
}

export function ProgressBar({
  progress,
  label,
  detail,
  color = colors.primary,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      {(label || detail) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {detail && <Text style={styles.detail}>{detail}</Text>}
        </View>
      )}
      <View style={styles.trackOuter}>
        <View
          style={[
            styles.trackInner,
            { width: `${clampedProgress}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  detail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  trackOuter: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  trackInner: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
