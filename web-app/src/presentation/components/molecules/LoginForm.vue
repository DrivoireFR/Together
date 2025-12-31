<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-container">
      <!-- Email -->
      <BaseInput
        v-model="form.email"
        type="email"
        label="Adresse email"
        placeholder="exemple@email.com"
        :error="errors.email"
        :disabled="authStore.isLoading"
        required
        :iconBefore="EnvelopeIcon"
        @blur="validateEmail"
      />
      
      <!-- Password -->
      <BaseInput
        v-model="form.password"
        type="password"
        label="Mot de passe"
        placeholder="••••••••"
        :error="errors.password"
        :disabled="authStore.isLoading"
        required
        :iconBefore="LockClosedIcon"
        @blur="validatePassword"
      />
      
      <!-- Remember Me -->
      <div class="remember-me">
        <label class="checkbox-label">
          <input
            v-model="form.rememberMe"
            type="checkbox"
            class="checkbox-input"
            :disabled="authStore.isLoading"
          />
          <span class="checkbox-text">Se souvenir de moi (30 jours)</span>
        </label>
      </div>
      
      <!-- Error message -->
      <div v-if="authStore.error" class="form-error">
        {{ authStore.error }}
      </div>
      
      <!-- Submit button -->
      <BaseButton
        type="submit"
        :loading="authStore.isLoading"
        :disabled="!isFormValid"
        class="form-submit"
      >
        Se connecter
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/domain/stores/authStore'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import type { LoginPayload } from '@/domain/types'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
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

// Form submission - now directly uses the store
const handleSubmit = async () => {
  validateEmail()
  validatePassword()
  
  if (isFormValid.value) {
    const result = await authStore.login({
      email: form.email.trim(),
      password: form.password,
      rememberMe: form.rememberMe
    })
    
    if (result.success) {
      router.push('/groups')
    }
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-2);
  background-color: var(--color-danger-light);
  border-radius: var(--border-radius);
  border: var(--border-width) solid var(--color-danger);
}

.form-submit {
  width: 100%;
}

.remember-me {
  display: flex;
  align-items: center;
  margin: var(--spacing-2) 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-right: var(--spacing-2);
  cursor: pointer;
  accent-color: var(--color-primary);
}

.checkbox-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.checkbox-input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>