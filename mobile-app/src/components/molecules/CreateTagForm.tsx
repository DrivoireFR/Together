import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BaseInput } from '../atoms/BaseInput';
import { BaseButton } from '../atoms/BaseButton';
import { useTasksStore } from '../../stores/tasksStore';
import { colors, spacing } from '../../theme';

const TAG_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16',
  '#10B981', '#06B6D4', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899', '#F43F5E', '#14B8A6',
];

interface CreateTagFormProps {
  groupId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTagForm({ groupId, onSuccess, onCancel }: CreateTagFormProps) {
  const { createTag, isLoading } = useTasksStore();
  const [label, setLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!label.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }
    const success = await createTag({
      label: label.trim(),
      color: selectedColor,
      groupId,
    });
    if (success) onSuccess?.();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <BaseInput
        label="Nom de la catégorie"
        value={label}
        onChangeText={setLabel}
        placeholder="Ex: Cuisine"
        error={error}
      />

      <View style={styles.colorGrid}>
        {TAG_COLORS.map((color) => (
          <View
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.colorSelected,
            ]}
          >
            <BaseButton
              title=""
              variant="ghost"
              onPress={() => setSelectedColor(color)}
              style={{ width: 40, height: 40 }}
            />
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <BaseButton
          title="Annuler"
          variant="outline"
          onPress={() => onCancel?.()}
        />
        <BaseButton
          title="Créer"
          onPress={handleSubmit}
          loading={isLoading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
});
