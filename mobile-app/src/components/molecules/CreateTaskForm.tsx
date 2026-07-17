import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BaseInput } from '../atoms/BaseInput';
import { BaseButton } from '../atoms/BaseButton';
import { TagChip } from '../atoms/TagChip';
import { useTasksStore } from '../../stores/tasksStore';
import { UniteFrequence } from '../../types/enums';
import { colors, spacing, fontSize } from '../../theme';

interface CreateTaskFormProps {
  groupId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTaskForm({ groupId, onSuccess, onCancel }: CreateTaskFormProps) {
  const { tags, createTask, isLoading } = useTasksStore();
  const [label, setLabel] = useState('');
  const [frequenceEstimee, setFrequenceEstimee] = useState('1');
  const [uniteFrequence, setUniteFrequence] = useState<UniteFrequence>(
    UniteFrequence.SEMAINE,
  );
  const [points, setPoints] = useState('1');
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>();
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!label.trim()) {
      setError('Le nom de la tâche est requis');
      return;
    }

    const success = await createTask({
      label: label.trim(),
      frequenceEstimee: parseInt(frequenceEstimee) || 1,
      uniteFrequence,
      groupId,
      tagId: selectedTagId,
      points: parseInt(points) || 1,
    });

    if (success) onSuccess?.();
  };

  const unitOptions: { label: string; value: UniteFrequence }[] = [
    { label: 'Jour', value: UniteFrequence.JOUR },
    { label: 'Semaine', value: UniteFrequence.SEMAINE },
    { label: 'Mois', value: UniteFrequence.MOIS },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <BaseInput
        label="Nom de la tâche"
        value={label}
        onChangeText={setLabel}
        placeholder="Ex: Faire la vaisselle"
        error={error}
      />

      <BaseInput
        label="Fréquence estimée"
        value={frequenceEstimee}
        onChangeText={setFrequenceEstimee}
        keyboardType="numeric"
        placeholder="1"
      />

      <Text style={styles.label}>Unité</Text>
      <View style={styles.unitRow}>
        {unitOptions.map((opt) => (
          <BaseButton
            key={opt.value}
            title={opt.label}
            variant={uniteFrequence === opt.value ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setUniteFrequence(opt.value)}
          />
        ))}
      </View>

      <BaseInput
        label="Points"
        value={points}
        onChangeText={setPoints}
        keyboardType="numeric"
        placeholder="1"
      />

      {tags.length > 0 && (
        <>
          <Text style={styles.label}>Catégorie</Text>
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <TagChip
                key={tag.id}
                tag={tag}
                selected={selectedTagId === tag.id}
                onPress={() =>
                  setSelectedTagId(selectedTagId === tag.id ? undefined : tag.id)
                }
              />
            ))}
          </View>
        </>
      )}

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
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  unitRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
});
