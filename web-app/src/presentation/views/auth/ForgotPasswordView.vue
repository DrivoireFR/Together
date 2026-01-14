<template>
  <AuthLayout>
    <template #title>
      Mot de passe oublié
    </template>
    
    <template #subtitle>
      Entrez votre adresse email pour recevoir un lien de réinitialisation
    </template>
    
    <div v-if="!emailSent" class="forgot-password-form">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Adresse email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="votre@email.com"
            required
            :disabled="isLoading"
          >
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>

        <BaseButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
          class="submit-btn"
        >
          {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien' }}
        </BaseButton>
      </form>
    </div>

    <div v-else class="success-message">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h3>Email envoyé !</h3>
      <p>Si cette adresse email est enregistrée, vous recevrez un lien de réinitialisation dans quelques instants.</p>
      <p class="info-text">Pensez à vérifier vos spams si vous ne recevez pas l'email.</p>
    </div>
    
    <template #footer>
      <router-link
        to="/login"
        class="auth-link"
      >
        ← Retour à la connexion
      </router-link>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authRepository } from '@/data/repositories/authRepository'
import AuthLayout from '@/presentation/layouts/AuthLayout.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const emailSent = ref(false)

const handleSubmit = async () => {
  if (!email.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await authRepository.requestPasswordReset({ email: email.value })

    if (result.isSuccess) {
      emailSent.value = true
    } else {
      errorMessage.value = result.message || 'Une erreur est survenue'
    }
  } catch {
    errorMessage.value = 'Une erreur est survenue lors de l\'envoi de l\'email'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.forgot-password-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
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
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: 0.5rem;
}

.submit-btn {
  width: 100%;
}

.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: var(--color-success-light, #dcfce7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg {
  width: 40px;
  height: 40px;
  color: var(--color-success, #22c55e);
}

.success-message h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
}

.success-message p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.info-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
}

.auth-link:hover {
  color: var(--color-primary-hover);
}
</style>
