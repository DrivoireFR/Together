<template>
  <AuthLayout>
    <template #title>
      Connexion à votre compte
    </template>
    
    <template #subtitle>
      Connectez-vous pour gérer vos groupes
    </template>

    <!-- Success message for password reset -->
    <div v-if="showResetSuccess" class="success-banner">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span>Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.</span>
    </div>
    
    <LoginForm />
    
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/presentation/layouts/AuthLayout.vue'
import LoginForm from '@/presentation/components/molecules/LoginForm.vue'

const route = useRoute()
const router = useRouter()
const showResetSuccess = ref(false)

onMounted(() => {
  // Check for reset=success query parameter
  if (route.query.reset === 'success') {
    showResetSuccess.value = true
    
    // Remove the query parameter from URL without reloading
    router.replace({ query: {} })
    
    // Hide the message after 8 seconds
    setTimeout(() => {
      showResetSuccess.value = false
    }, 8000)
  }
})
</script>

<style scoped>
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