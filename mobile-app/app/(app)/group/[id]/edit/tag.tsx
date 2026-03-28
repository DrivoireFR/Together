import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseInput } from '../../../../../src/components/atoms/BaseInput';
import { BaseButton } from '../../../../../src/components/atoms/BaseButton';
import { useTasksStore } from '../../../../../src/stores/tasksStore';
import { colors, spacing, fontSize } from '../../../../../src/theme';

const TAG_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16',
  '#10B981', '#06B6D4', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#F43F5E', '#14B8A6',
];

export default function EditTagScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedTagFilter, updateTag, deleteTag, isLoading } = useTasksStore();

  const tag = selectedTagFilter;

  const [label, setLabel] = useState(tag?.label ?? '');
  const [selectedColor, setSelectedColor] = useState(tag?.color ?? TAG_COLORS[0]);

  if (!tag) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Catégorie non trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleUpdate = async () => {
    const success = await updateTag(tag.id, {
      label: label.trim(),
      color: selectedColor,
    });
    if (success) router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la catégorie',
      'Les tâches associées ne seront pas supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteTag(tag.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Modifier la catégorie</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <BaseInput
          label="Nom de la catégorie"
          value={label}
          onChangeText={setLabel}
        />

        <Text style={styles.label}>Couleur</Text>
        <View style={styles.colorGrid}>
          {TAG_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <BaseButton
            title="Supprimer"
            variant="danger"
            onPress={handleDelete}
            size="sm"
          />
          <BaseButton
            title="Enregistrer"
            onPress={handleUpdate}
            loading={isLoading}
          />
        </View>
      </ScrollView>
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
  content: { flex: 1, padding: spacing.xl },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
