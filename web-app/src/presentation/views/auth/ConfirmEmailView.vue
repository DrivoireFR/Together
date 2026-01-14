<template>
  <AuthLayout>
    <template #title>
      {{ pageTitle }}
    </template>
    
    <template #subtitle>
      {{ pageSubtitle }}
    </template>
    
    <div class="confirm-email-content">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Vérification en cours...</p>
      </div>

      <!-- Success state -->
      <div v-else-if="isSuccess" class="success-state">
        <div class="status-icon success-icon">
          <CheckCircleIcon class="icon" />
        </div>
        <p class="message">{{ successMessage }}</p>
        <router-link to="/login" class="btn btn-primary">
          Se connecter
        </router-link>
      </div>

      <!-- Error state -->
      <div v-else-if="isError" class="error-state">
        <div class="status-icon error-icon">
          <XCircleIcon class="icon" />
        </div>
        <p class="message">{{ errorMessage }}</p>
        
        <div class="actions">
          <button 
            v-if="canResend" 
            class="btn btn-primary"
            :disabled="isResending"
            @click="handleResendConfirmation"
          >
            {{ isResending ? 'Envoi en cours...' : 'Renvoyer le lien' }}
          </button>
          <router-link to="/login" class="btn btn-secondary">
            Retour à la connexion
          </router-link>
        </div>
      </div>

      <!-- No token state (direct access) -->
      <div v-else class="no-token-state">
        <p class="message">
          Entrez votre adresse email pour recevoir un nouveau lien de confirmation.
        </p>
        <form @submit.prevent="handleResendManual" class="resend-form">
          <input
            v-model="manualEmail"
            type="email"
            placeholder="Votre adresse email"
            class="email-input"
            required
          />
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isResending || !manualEmail"
          >
            {{ isResending ? 'Envoi en cours...' : 'Envoyer le lien' }}
          </button>
        </form>
        <div v-if="resendMessage" class="resend-message" :class="{ success: resendSuccess }">
          {{ resendMessage }}
        </div>
        <router-link to="/login" class="btn btn-link">
          Retour à la connexion
        </router-link>
      </div>
    </div>
    
    <template #footer>
      <router-link
        to="/register"
        class="auth-link"
      >
        Pas encore de compte ? Inscrivez-vous
      </router-link>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import AuthLayout from '@/presentation/layouts/AuthLayout.vue'
import { authRepository } from '@/data/repositories/authRepository'
import { useAuthStore } from '@/domain/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(false)
const isSuccess = ref(false)
const isError = ref(false)
const isResending = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const canResend = ref(false)
const manualEmail = ref('')
const resendMessage = ref('')
const resendSuccess = ref(false)

const token = computed(() => route.query.token as string | undefined)
const email = computed(() => route.query.email as string | undefined)
const hasParams = computed(() => !!token.value && !!email.value)

const pageTitle = computed(() => {
  if (isSuccess.value) return 'Email confirmé !'
  if (isError.value) return 'Erreur de confirmation'
  if (isLoading.value) return 'Confirmation en cours'
  return 'Confirmer votre email'
})

const pageSubtitle = computed(() => {
  if (isSuccess.value) return 'Votre compte est maintenant activé'
  if (isError.value) return 'Un problème est survenu'
  if (isLoading.value) return 'Veuillez patienter...'
  return 'Vérifiez votre boîte mail'
})

onMounted(async () => {
  if (hasParams.value) {
    await confirmEmail()
  }
})

async function confirmEmail() {
  if (!token.value || !email.value) return

  isLoading.value = true
  isError.value = false
  isSuccess.value = false

  const result = await authRepository.confirmEmail(token.value, email.value)

  isLoading.value = false

  if (result.isSuccess) {
    isSuccess.value = true
    
    // Si l'utilisateur était connecté, on le déconnecte pour forcer une reconnexion
    // qui récupérera l'état emailVerified à jour
    const wasAuthenticated = authStore.isAuthenticated
    if (wasAuthenticated) {
      authStore.logout()
      successMessage.value = 'Votre adresse email a été confirmée avec succès. Vous pouvez maintenant vous reconnecter.'
    } else {
      successMessage.value = result.data?.message || 'Votre adresse email a été confirmée avec succès.'
    }
  } else {
    isError.value = true
    errorMessage.value = result.message || 'Le lien de confirmation est invalide ou a expiré.'
    canResend.value = true
  }
}

async function handleResendConfirmation() {
  if (!email.value) return

  isResending.value = true
  const result = await authRepository.resendConfirmation(email.value)
  isResending.value = false

  if (result.isSuccess) {
    errorMessage.value = result.data.message || 'Un nouveau lien a été envoyé à votre adresse email.'
    canResend.value = false
  }
}

async function handleResendManual() {
  if (!manualEmail.value) return

  isResending.value = true
  resendMessage.value = ''

  const result = await authRepository.resendConfirmation(manualEmail.value)
  isResending.value = false

  resendSuccess.value = result.isSuccess
  resendMessage.value = result.isSuccess
    ? result.data.message
    : result.message || 'Si cette adresse est enregistrée, un email a été envoyé.'
}
</script>

<style scoped>
.confirm-email-content {
  text-align: center;
  padding: var(--spacing-6);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-4);
}

.success-icon {
  background-color: var(--color-success-light, #dcfce7);
}

.success-icon .icon {
  width: 40px;
  height: 40px;
  color: var(--color-success, #22c55e);
}

.error-icon {
  background-color: var(--color-error-light, #fee2e2);
}

.error-icon .icon {
  width: 40px;
  height: 40px;
  color: var(--color-error, #ef4444);
}

.message {
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-6);
  line-height: 1.5;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.btn {
  display: inline-block;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
  border: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.btn-secondary:hover {
  background-color: var(--color-gray-200);
}

.btn-link {
  background: none;
  color: var(--color-primary);
  padding: var(--spacing-2);
}

.btn-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.resend-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.email-input {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  outline: none;
  transition: var(--transition-fast);
}

.email-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light, rgba(99, 102, 241, 0.1));
}

.resend-message {
  padding: var(--spacing-3);
  border-radius: var(--border-radius-md);
  background-color: var(--color-gray-100);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-4);
}

.resend-message.success {
  background-color: var(--color-success-light, #dcfce7);
  color: var(--color-success, #22c55e);
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
