<template>
  <form @submit.prevent="handleSubmit" class="edit-task-form">
    <div class="form-header">
      <h2 class="form-title">Modifier la tâche</h2>
      <p class="form-description">
        Modifiez les détails de votre tâche et réorganisez-la avec un tag.
      </p>
    </div>

    <div class="form-content">
      <div class="form-group">
        <label for="label" class="form-label">
          Nom de la tâche *
        </label>
        <BaseInput
          id="label"
          v-model="formData.label"
          placeholder="Ex: Nettoyer le bureau"
          :error="errors.label"
          required
        />
      </div>

      <div class="form-group">
        <BaseSlider
          id="points"
          v-model="formData.points"
          label="Niveau de difficulté"
          :min="1"
          :max="10"
          start-label="😎 Pas relou"
          end-label="😵‍💫 Relou"
          :descriptions="[
            '😎 Très facile',
            '🙂 Facile', 
            '😊 Plutôt facile',
            '😐 Un peu relou',
            '😕 Moyen',
            '😔 Moyen+',
            '😖 Plutôt relou',
            '😫 Relou',
            '😵 Très relou',
            '😵‍💫 Extrême'
          ]"
          :error="errors.points"
        />
      </div>

      <div class="form-group">
        <label for="iconUrl" class="form-label">
          URL de l'icône (optionnel)
        </label>
        <BaseInput
          id="iconUrl"
          v-model="formData.iconUrl"
          type="url"
          placeholder="https://exemple.com/icon.png"
          :error="errors.iconUrl"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="frequenceEstimee" class="form-label">
            Fréquence estimée *
          </label>
          <BaseInput
            id="frequenceEstimee"
            v-model.number="formData.frequenceEstimee"
            type="number"
            min="1"
            placeholder="1"
            :error="errors.frequenceEstimee"
            required
          />
        </div>

        <div class="form-group">
          <label for="uniteFrequence" class="form-label">
            Unité de temps *
          </label>
          <select
            id="uniteFrequence"
            v-model="formData.uniteFrequence"
            class="form-select"
            :class="{ 'form-select--error': errors.uniteFrequence }"
            required
          >
            <option value="jour">par jour</option>
            <option value="semaine">par semaine</option>
            <option value="mois">par mois</option>
          </select>
          <span v-if="errors.uniteFrequence" class="form-error">
            {{ errors.uniteFrequence }}
          </span>
        </div>
      </div>

      <div class="form-group" v-if="tags.length > 0">
        <label for="tagId" class="form-label">
          Tag (optionnel)
        </label>
        <select
          id="tagId"
          v-model="formData.tagId"
          class="form-select"
          :class="{ 'form-select--error': errors.tagId }"
        >
          <option value="">Aucun tag</option>
          <option 
            v-for="tag in tags" 
            :key="tag.id" 
            :value="tag.id"
          >
            {{ tag.label }}
          </option>
        </select>
        <span v-if="errors.tagId" class="form-error">
          {{ errors.tagId }}
        </span>
      </div>

      <div class="frequency-preview" v-if="frequencyText">
        <p class="frequency-text">
          <strong>Aperçu :</strong> {{ frequencyText }}
        </p>
      </div>
    </div>

    <div class="form-actions">
      <BaseButton
        type="button"
        variant="ghost"
        @click="handleCancel"
        :disabled="tasksStore.isLoading"
      >
        Annuler
      </BaseButton>
      <BaseButton
        type="submit"
        variant="primary"
        :loading="tasksStore.isLoading"
        :disabled="!isFormValid"
      >
        Modifier la tâche
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { type Tag, type Task, UniteFrequence, type UpdateTaskPayload } from '@/domain/types'
import { useTasksStore } from '@/domain/stores/tasksStore'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import BaseSlider from '../atoms/BaseSlider.vue'

interface Props {
  task: Task
  tags: Tag[]
  onSuccess?: () => void  // Callback for modal closing
  onCancel?: () => void   // Callback for cancel action
}

const props = withDefaults(defineProps<Props>(), {
  onSuccess: () => {},
  onCancel: () => {}
})

const tasksStore = useTasksStore()

const formData = ref<UpdateTaskPayload>({
  label: '',
  frequenceEstimee: 1,
  uniteFrequence: UniteFrequence.SEMAINE,
  iconUrl: '',
  tagId: undefined,
  points: props.task.points
})

const errors = ref<Partial<Record<keyof UpdateTaskPayload, string>>>({})

// Initialiser le formulaire avec les données de la tâche
onMounted(() => {
  formData.value = {
    label: props.task.label,
    frequenceEstimee: props.task.frequenceEstimee,
    uniteFrequence: props.task.uniteFrequence,
    iconUrl: props.task.iconUrl || '',
    tagId: props.task.tag?.id,
    points: props.task.points
  }
})

const frequencyText = computed(() => {
  const { frequenceEstimee, uniteFrequence } = formData.value
  
  if (!frequenceEstimee || frequenceEstimee < 1) return ''
  
  const unit = uniteFrequence === UniteFrequence.JOUR ? 'jour' : 
               uniteFrequence === UniteFrequence.SEMAINE ? 'semaine' : 'mois'
  
  if (frequenceEstimee === 1) {
    return `1 fois par ${unit}`
  }
  
  return `${frequenceEstimee} fois par ${unit}`
})

const isFormValid = computed(() => {
  return formData.value.label && formData.value.label.trim().length > 0 &&
         formData.value.frequenceEstimee && formData.value.frequenceEstimee > 0 &&
         formData.value.uniteFrequence &&
         Object.keys(errors.value).length === 0
})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.label?.trim()) {
    errors.value.label = 'Le nom de la tâche est requis'
  }
  
  if (!formData.value.frequenceEstimee || formData.value.frequenceEstimee < 1) {
    errors.value.frequenceEstimee = 'La fréquence doit être au moins de 1'
  }
  
  if (!formData.value.uniteFrequence) {
    errors.value.uniteFrequence = 'L\'unité de temps est requise'
  }
  
  if (formData.value.iconUrl && !isValidUrl(formData.value.iconUrl)) {
    errors.value.iconUrl = 'L\'URL de l\'icône n\'est pas valide'
  }
  
  return Object.keys(errors.value).length === 0
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  // Ne pas inclure groupId dans les données d'update
  const payload = {
    label: formData.value.label,
    frequenceEstimee: formData.value.frequenceEstimee,
    uniteFrequence: formData.value.uniteFrequence,
    iconUrl: formData.value.iconUrl || undefined,
    tagId: formData.value.tagId || undefined,
    points: formData.value.points
  }
  
  const result = await tasksStore.updateTask(props.task.id, payload)
  
  if (result.success) {
    props.onSuccess()
  }
}

const handleCancel = () => {
  // Reset form to original task data
  formData.value = {
    label: props.task.label,
    frequenceEstimee: props.task.frequenceEstimee,
    uniteFrequence: props.task.uniteFrequence,
    iconUrl: props.task.iconUrl || '',
    tagId: props.task.tag?.id,
    points: props.task.points
  }
  errors.value = {}
  
  props.onCancel()
}


</script>

<style scoped>
.edit-task-form {
  max-width: 32rem;
  margin: 0 auto;
}

.form-header {
  margin-bottom: var(--spacing-6);
  text-align: center;
}

.form-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-2) 0;
}

.form-description {
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.5;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.form-select {
  padding: var(--spacing-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  background: var(--color-white);
  transition: border-color 0.15s ease;
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select--error {
  border-color: var(--color-red-500);
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-red-500);
}

.frequency-preview {
  padding: var(--spacing-3);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--color-primary);
}

.frequency-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-gray-200);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
}
</style> 