import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTasksStore } from '../../stores/tasksStore';
import { colors, borderRadius, spacing, fontSize } from '../../theme';

interface TagFilterProps {
  tags: { id: number; label: string; color: string }[];
  onTagPress?: (tag: { id: number; label: string; color: string }) => void;
}

export function TagFilter({ tags, onTagPress }: TagFilterProps) {
  const { selectedTagFilter, setTagFilter } = useTasksStore();

  const handleTagPress = (tag: { id: number; label: string; color: string }) => {
    if (selectedTagFilter?.id === tag.id) {
      setTagFilter(null);
    } else {
      setTagFilter(tag);
    }
    onTagPress?.(tag);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedTagFilter && styles.filterChipActive,
          ]}
          onPress={() => setTagFilter(null)}
        >
          <Text
            style={[
              styles.filterText,
              !selectedTagFilter && styles.filterTextActive,
            ]}
          >
            Toutes
          </Text>
        </TouchableOpacity>

        {tags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={[
              styles.filterChip,
              { borderColor: tag.color },
              selectedTagFilter?.id === tag.id && {
                backgroundColor: tag.color,
              },
            ]}
            onPress={() => handleTagPress(tag)}
          >
            <Text
              style={[
                styles.filterText,
                selectedTagFilter?.id === tag.id && { color: colors.white },
              ]}
              numberOfLines={1}
            >
              {tag.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  filterTextActive: { color: colors.white },
});
