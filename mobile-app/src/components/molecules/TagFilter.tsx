import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { Tag } from '../../types';
import { useTasksStore } from '../../stores/tasksStore';
import { colors, borderRadius, spacing, fontSize } from '../../theme';

interface TagFilterProps {
  tags: Tag[];
  onTagPress?: (tag: Tag) => void;
}

export function TagFilter({ tags, onTagPress }: TagFilterProps) {
  const { selectedTagFilter, setTagFilter, showUrgentOnly, toggleUrgentFilter } =
    useTasksStore();

  const handleTagPress = (tag: Tag) => {
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

        <TouchableOpacity
          style={[
            styles.filterChip,
            styles.urgentChip,
            showUrgentOnly && styles.urgentChipActive,
          ]}
          onPress={toggleUrgentFilter}
        >
          <Text
            style={[
              styles.filterText,
              showUrgentOnly && { color: colors.white },
            ]}
          >
            🔥 Urgent
          </Text>
        </TouchableOpacity>
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
  urgentChip: {
    borderColor: colors.error,
  },
  urgentChipActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
});
