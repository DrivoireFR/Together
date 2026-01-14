<template>
  <AuthLayout>
    <template #title>
      {{ isSuccess ? 'Vérifiez votre boîte mail' : 'Créer votre compte' }}
    </template>
    
    <template #subtitle>
      <span v-if="!isSuccess">
        Inscrivez-vous pour rejoindre des groupes
      </span>
      <span v-else>
        Un email de confirmation vient de vous être envoyé. Cliquez sur le lien qu’il contient pour activer votre compte.
      </span>
    </template>
    
    <div v-if="!isSuccess">
      <RegisterForm @registered="handleRegistered" />
    </div>
    <div v-else class="success-panel">
      <p class="success-message">
        Nous avons envoyé un email de confirmation à <strong>{{ lastRegisteredEmail }}</strong>.<br>
        Cliquez sur le lien dans cet email pour confirmer votre adresse et activer votre compte.
      </p>
      <router-link
        to="/login"
        class="primary-link"
      >
        Aller à la page de connexion
      </router-link>
    </div>
    
    <template #footer>
      <router-link
        to="/login"
        class="auth-link"
      >
        Déjà un compte ? Connectez-vous
      </router-link>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '@/presentation/layouts/AuthLayout.vue'
import RegisterForm from '@/presentation/components/molecules/RegisterForm.vue'
import { ref } from 'vue'

const isSuccess = ref(false)
const lastRegisteredEmail = ref('')

const handleRegistered = (email: string) => {
  lastRegisteredEmail.value = email
  isSuccess.value = true
}


</script>

<style scoped>
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

.success-panel {
  padding: var(--spacing-6);
  text-align: center;
}

.success-message {
  margin-bottom: var(--spacing-4);
  color: var(--color-gray-700);
}

.primary-link {
  display: inline-block;
  margin-top: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  background-color: var(--color-primary);
  color: var(--color-white);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
}

.primary-link:hover {
  background-color: var(--color-primary-hover);
}
</style> 