import React, { useState, useEffect } from 'react';
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
import { TagChip } from '../../../../../src/components/atoms/TagChip';
import { useTasksStore } from '../../../../../src/stores/tasksStore';
import { UniteFrequence } from '../../../../../src/types/enums';
import { colors, spacing, fontSize } from '../../../../../src/theme';

export default function EditTaskScreen() {
  const { id, taskId } = useLocalSearchParams<{ id: string; taskId: string }>();
  const { tasks, tags, updateTask, deleteTask, isLoading } = useTasksStore();

  const task = tasks.find((t) => t.id === parseInt(taskId, 10));

  const [label, setLabel] = useState(task?.label ?? '');
  const [frequenceEstimee, setFrequenceEstimee] = useState(
    String(task?.frequenceEstimee ?? 1),
  );
  const [uniteFrequence, setUniteFrequence] = useState<string>(
    task?.uniteFrequence ?? UniteFrequence.SEMAINE,
  );
  const [points, setPoints] = useState(String(task?.points ?? 1));
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(
    task?.tag?.id,
  );

  if (!task) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tâche non trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleUpdate = async () => {
    const success = await updateTask(task.id, {
      label: label.trim(),
      frequenceEstimee: parseInt(frequenceEstimee) || 1,
      uniteFrequence: uniteFrequence as 'jour' | 'semaine' | 'mois',
      tagId: selectedTagId,
      points: parseInt(points) || 1,
    });
    if (success) router.back();
  };

  const handleDelete = () => {
    Alert.alert('Supprimer la tâche', 'Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(task.id);
          router.back();
        },
      },
    ]);
  };

  const unitOptions: { label: string; value: string }[] = [
    { label: 'Jour', value: UniteFrequence.JOUR },
    { label: 'Semaine', value: UniteFrequence.SEMAINE },
    { label: 'Mois', value: UniteFrequence.MOIS },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Modifier la tâche</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <BaseInput
          label="Nom de la tâche"
          value={label}
          onChangeText={setLabel}
        />

        <BaseInput
          label="Fréquence estimée"
          value={frequenceEstimee}
          onChangeText={setFrequenceEstimee}
          keyboardType="numeric"
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
                    setSelectedTagId(
                      selectedTagId === tag.id ? undefined : tag.id,
                    )
                  }
                />
              ))}
            </View>
          </>
        )}

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
