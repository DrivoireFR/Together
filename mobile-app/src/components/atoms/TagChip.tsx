import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, fontSize } from '../../theme';

interface TagChipProps {
  tag: { id: number; label: string; color: string };
  selected?: boolean;
  onPress?: () => void;
}

export function TagChip({ tag, selected, onPress }: TagChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: tag.color },
        selected && { backgroundColor: tag.color },
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.text, selected && { color: colors.white }]}
        numberOfLines={1}
      >
        {tag.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
});
