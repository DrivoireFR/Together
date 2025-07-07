<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-4">
      <!-- Email -->
      <BaseInput
        v-model="form.email"
        type="email"
        label="Adresse email"
        placeholder="exemple@email.com"
        :error="errors.email"
        :disabled="loading"
        required
        :iconBefore="EnvelopeIcon"
      />
      
      <!-- Password -->
      <BaseInput
        v-model="form.password"
        type="password"
        label="Mot de passe"
        placeholder="••••••••"
        :error="errors.password"
        :disabled="loading"
        required
        :iconBefore="LockClosedIcon"
      />
      
      <!-- Error message -->
      <div v-if="globalError" class="text-red-600 text-sm">
        {{ globalError }}
      </div>
      
      <!-- Submit button -->
      <BaseButton
        type="submit"
        :loading="loading"
        :disabled="!isFormValid"
        class="w-full"
      >
        Se connecter
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import type { LoginPayload } from '@/shared/types/api'

interface Props {
  loading?: boolean
  globalError?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  submit: [payload: LoginPayload]
}>()

// Form state
const form = reactive({
  email: '',
  password: ''
})

// Validation errors
const errors = reactive({
  email: '',
  password: ''
})

// Computed
const isFormValid = computed(() => {
  return form.email.trim() !== '' && 
         form.password.trim() !== '' && 
         !errors.email && 
         !errors.password
})

// Validation functions
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'L\'email est requis'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Format d\'email invalide'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password.trim()) {
    errors.password = 'Le mot de passe est requis'
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  } else {
    errors.password = ''
  }
}

// Form submission
const handleSubmit = () => {
  validateEmail()
  validatePassword()
  
  if (isFormValid.value) {
    emit('submit', {
      email: form.email.trim(),
      password: form.password
    })
  }
}
</script>