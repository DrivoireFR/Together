<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-4">
      <!-- Nom du groupe -->
      <BaseInput
        v-model="form.nom"
        type="text"
        label="Nom du groupe"
        placeholder="Mon super groupe"
        :error="errors.nom"
        :disabled="loading"
        required
        :iconBefore="UserGroupIcon"
      />
      
      <!-- Error message -->
      <div v-if="globalError" class="text-red-600 text-sm">
        {{ globalError }}
      </div>
      
      <!-- Actions -->
      <div class="flex space-x-3">
        <BaseButton
          type="button"
          variant="outline"
          @click="$emit('cancel')"
          :disabled="loading"
        >
          Annuler
        </BaseButton>
        
        <BaseButton
          type="submit"
          :loading="loading"
          :disabled="!isFormValid"
          class="flex-1"
        >
          Créer le groupe
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import type { CreateGroupPayload } from '@/shared/types/api'

interface Props {
  loading?: boolean
  globalError?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  submit: [payload: CreateGroupPayload]
  cancel: []
}>()

// Form state
const form = reactive({
  nom: ''
})

// Validation errors
const errors = reactive({
  nom: ''
})

// Computed
const isFormValid = computed(() => {
  return form.nom.trim() !== '' && !errors.nom
})

// Validation functions
const validateNom = () => {
  if (!form.nom.trim()) {
    errors.nom = 'Le nom du groupe est requis'
  } else if (form.nom.trim().length < 3) {
    errors.nom = 'Le nom doit contenir au moins 3 caractères'
  } else if (form.nom.trim().length > 50) {
    errors.nom = 'Le nom ne peut pas dépasser 50 caractères'
  } else {
    errors.nom = ''
  }
}

// Form submission
const handleSubmit = () => {
  validateNom()
  
  if (isFormValid.value) {
    emit('submit', {
      nom: form.nom.trim()
    })
  }
}
</script>