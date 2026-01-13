<template>
  <form @submit.prevent="handleSubmit" class="edit-tag-form">
    <div class="form-header">
      <h2 class="form-title">Modifier le tag</h2>
      <p class="form-description">
        Modifiez les détails de votre tag et changez son icône.
      </p>
    </div>

    <div class="form-content">
      <div class="form-group">
        <label for="label" class="form-label">
          Nom du tag *
        </label>
        <BaseInput
          id="label"
          v-model="formData.label"
          placeholder="Ex: Ménage, Cuisine, Administratif..."
          :error="errors.label"
          required
        />
      </div>

      <div class="form-group">
        <label for="color" class="form-label">
          Couleur du tag *
        </label>
        <div class="color-input-container">
          <input
            id="color"
            v-model="formData.color"
            type="color"
            class="color-input"
            :class="{ 'color-input--error': errors.color }"
            required
          />
          <BaseInput
            v-model="formData.color"
            placeholder="#3B82F6"
            :error="errors.color"
            class="color-text-input"
          />
        </div>
        <span v-if="errors.color" class="form-error">
          {{ errors.color }}
        </span>
      </div>

      <div class="form-group">
        <IconSelector
          v-model="formData.icon"
          label="Icône (optionnel)"
          :color="formData.color"
          :preview-label="formData.label"
        />
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
        Modifier le tag
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Tag, UpdateTagPayload } from '@/domain/types'
import { useTasksStore } from '@/domain/stores/tasksStore'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import IconSelector from '@/presentation/components/molecules/IconSelector.vue'
import Icon from '@/presentation/components/atoms/Icon.vue'

const tasksStore = useTasksStore()

const tag = tasksStore.selectedTagFilter


const formData = ref<UpdateTagPayload>({
  label: tag?.label,
  color: tag?.color,
  icon: tag?.icon
})

const errors = ref<Partial<Record<keyof UpdateTagPayload, string>>>({})

// Initialiser le formulaire avec les données du tag
onMounted(() => {

})

const isFormValid = computed(() => {
  return (formData.value.label?.trim() ?? '').length > 0 &&
         (formData.value.color ?? '').length > 0 &&
         isValidColor(formData.value.color || '') &&
         Object.keys(errors.value).length === 0
})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.label?.trim()) {
    errors.value.label = 'Le nom du tag est requis'
  } else if (formData.value.label.trim().length < 2) {
    errors.value.label = 'Le nom du tag doit contenir au moins 2 caractères'
  }
  
  if (!formData.value.color) {
    errors.value.color = 'La couleur est requise'
  } else if (!isValidColor(formData.value.color)) {
    errors.value.color = 'La couleur doit être un code hexadécimal valide (ex: #3B82F6)'
  }
  
  return Object.keys(errors.value).length === 0
}

const isValidColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(color)
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  const payload: UpdateTagPayload = {
    label: formData.value.label?.trim(),
    color: formData.value.color,
    ...(formData.value.icon !== undefined && { icon: formData.value.icon })
  }
  
  tasksStore.updateTag(payload)
}

const handleCancel = () => {
  errors.value = {}
  
  tasksStore.onCancelTagEdit()
}

// Validation en temps réel
watch(() => formData.value.label, () => {
  if (errors.value.label) {
    delete errors.value.label
  }
})

watch(() => formData.value.color, () => {
  if (errors.value.color) {
    delete errors.value.color
  }
})
</script>

<style scoped>
.edit-tag-form {
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

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.color-input-container {
  display: flex;
  gap: var(--spacing-3);
  align-items: flex-start;
}

.color-input {
  width: 4rem;
  height: 2.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  background: none;
  transition: border-color 0.15s ease;
}

.color-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.color-input--error {
  border-color: var(--color-red-500);
}

.color-text-input {
  flex: 1;
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-red-500);
}

.color-preview {
  padding: var(--spacing-3);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--color-primary);
}

.preview-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.preview-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.tag-preview {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  min-height: 1.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tag-preview-icon {
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tag-preview-icon :deep(svg) {
  width: 100%;
  height: 100%;
  filter: brightness(0) invert(1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-gray-200);
}

@media (max-width: 640px) {
  .color-input-container {
    flex-direction: column;
    gap: var(--spacing-2);
  }
  
  .color-input {
    width: 100%;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .preview-container {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
}
</style>
