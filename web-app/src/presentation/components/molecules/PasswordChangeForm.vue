<template>
  <div class="password-change-section">
    <h3 class="section-title">Changer de mot de passe</h3>
    
    <div v-if="successMessage" class="success-banner">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      {{ successMessage }}
    </div>

    <form @submit.prevent="handleSubmit" class="password-form">
      <div class="form-group">
        <label for="oldPassword">Ancien mot de passe</label>
        <input
          id="oldPassword"
          v-model="formData.oldPassword"
          type="password"
          placeholder="••••••••"
          required
          :disabled="isLoading"
        >
      </div>

      <div class="form-group">
        <label for="newPassword">Nouveau mot de passe</label>
        <input
          id="newPassword"
          v-model="formData.newPassword"
          type="password"
          placeholder="••••••••"
          required
          minlength="6"
          :disabled="isLoading"
        >
        <div v-if="passwordError" class="field-error">
          {{ passwordError }}
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmer le nouveau mot de passe</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          minlength="6"
          :disabled="isLoading"
        >
        <div v-if="confirmError" class="field-error">
          {{ confirmError }}
        </div>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="requirements-box">
        <p>Votre mot de passe doit :</p>
        <ul>
          <li>Contenir au moins 6 caractères</li>
        </ul>
      </div>

      <div class="form-actions">
        <BaseButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading || !isFormValid"
          class="submit-btn"
        >
          {{ isLoading ? 'Changement en cours...' : 'Changer le mot de passe' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/domain/stores/authStore'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

const authStore = useAuthStore()

const formData = ref({
  oldPassword: '',
  newPassword: ''
})

const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const passwordError = ref('')
const confirmError = ref('')

const isFormValid = computed(() => {
  return (
    formData.value.oldPassword.length > 0 &&
    formData.value.newPassword.length >= 6 &&
    confirmPassword.value.length >= 6 &&
    formData.value.newPassword === confirmPassword.value
  )
})

const validatePassword = () => {
  if (formData.value.newPassword.length > 0 && formData.value.newPassword.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return false
  }
  passwordError.value = ''
  return true
}

const validateConfirm = () => {
  if (confirmPassword.value.length > 0 && formData.value.newPassword !== confirmPassword.value) {
    confirmError.value = 'Les mots de passe ne correspondent pas'
    return false
  }
  confirmError.value = ''
  return true
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await authStore.changePassword({
      oldPassword: formData.value.oldPassword,
      newPassword: formData.value.newPassword
    })

    if (result.success) {
      successMessage.value = result.message || 'Votre mot de passe a été modifié avec succès'
      // Reset form
      formData.value = {
        oldPassword: '',
        newPassword: ''
      }
      confirmPassword.value = ''
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      errorMessage.value = result.error || 'Une erreur est survenue'
    }
  } catch {
    errorMessage.value = 'Une erreur est survenue lors du changement de mot de passe'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.password-change-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
}

.success-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-success-light, #dcfce7);
  border: 1px solid var(--color-success, #22c55e);
  border-radius: var(--border-radius);
  color: var(--color-success-dark, #166534);
  font-size: var(--font-size-sm);
  margin-bottom: 1.5rem;
}

.success-banner svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.password-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: var(--font-size-base);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  transition: var(--transition-fast);
  font-family: inherit;
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-background);
}

.field-error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: 0.375rem;
}

.error-message {
  padding: 0.75rem 1rem;
  background: var(--color-danger-light, #fee2e2);
  border: 1px solid var(--color-danger);
  border-radius: var(--border-radius);
  color: var(--color-danger-dark, #991b1b);
  font-size: var(--font-size-sm);
  margin-bottom: 1rem;
}

.requirements-box {
  background: var(--color-background);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.requirements-box p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: 0.5rem;
}

.requirements-box ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.requirements-box li {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  padding-left: 1.25rem;
  margin-bottom: 0.25rem;
  position: relative;
}

.requirements-box li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--color-success, #22c55e);
}

.form-actions {
  margin-top: 1.5rem;
}

.submit-btn {
  width: 100%;
  max-width: 300px;
}
</style>
