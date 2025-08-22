<template>
  <form @submit.prevent="handleSubmit" class="create-task-form">
    <div class="form-header">
      <h2 class="form-title">Créer une nouvelle tâche</h2>
      <p class="form-description">
        Définissez les détails de votre tâche et organisez-la avec un tag.
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
        Créer la tâche
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { type Tag, type CreateTaskPayload, UniteFrequence } from '@/shared/types/api'
import { useTasksStore } from '@/domain/stores/tasksStore'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseSlider from '@/presentation/components/atoms/BaseSlider.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

interface Props {
  tags: Tag[]
  groupId: number
  onSuccess?: () => void  // Callback for modal closing
  onCancel?: () => void   // Callback for cancel action
}

const props = withDefaults(defineProps<Props>(), {
  onSuccess: () => {},
  onCancel: () => {}
})

const tasksStore = useTasksStore()

const formData = ref<CreateTaskPayload>({
  label: '',
  frequenceEstimee: 1,
  uniteFrequence: UniteFrequence.SEMAINE,
  groupId: props.groupId,
  iconUrl: '',
  tagId: undefined,
  points: 5 // Valeur par défaut au milieu
})

const errors = ref<Partial<Record<keyof CreateTaskPayload, string>>>({})

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
  return formData.value.label.trim().length > 0 &&
         formData.value.frequenceEstimee > 0 &&
         formData.value.uniteFrequence &&
         Object.keys(errors.value).length === 0
})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.label.trim()) {
    errors.value.label = 'Le nom de la tâche est requis'
  }
  
  if (!formData.value.frequenceEstimee || formData.value.frequenceEstimee < 1) {
    errors.value.frequenceEstimee = 'La fréquence doit être au moins de 1'
  }
  
  if (!formData.value.points || formData.value.points < 1 || formData.value.points > 10) {
    errors.value.points = 'Le niveau de difficulté doit être entre 1 et 10'
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
  
  const payload: CreateTaskPayload = {
    ...formData.value,
    iconUrl: formData.value.iconUrl || undefined,
    tagId: formData.value.tagId || undefined
  }
  
  const result = await tasksStore.createTask(payload)
  
  if (result.success) {
    // Reset form
    formData.value = {
      label: '',
      frequenceEstimee: 1,
      uniteFrequence: UniteFrequence.SEMAINE,
      groupId: props.groupId,
      iconUrl: '',
      tagId: undefined,
      points: 5
    }
    errors.value = {}
    
    props.onSuccess()
  }
}

const handleCancel = () => {
  // Reset form
  formData.value = {
    label: '',
    frequenceEstimee: 1,
    uniteFrequence: UniteFrequence.SEMAINE,
    groupId: props.groupId,
    iconUrl: '',
    tagId: undefined,
    points: 5
  }
  errors.value = {}
  
  props.onCancel()
}

// Validation en temps réel
watch(() => formData.value.label, () => {
  if (errors.value.label) {
    delete errors.value.label
  }
})

watch(() => formData.value.frequenceEstimee, () => {
  if (errors.value.frequenceEstimee) {
    delete errors.value.frequenceEstimee
  }
})

watch(() => formData.value.points, () => {
  if (errors.value.points) {
    delete errors.value.points
  }
})

watch(() => formData.value.iconUrl, () => {
  if (errors.value.iconUrl) {
    delete errors.value.iconUrl
  }
})


</script>

<style scoped>
.create-task-form {
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