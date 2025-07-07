<template>
  <AuthLayout>
    <template #title>
      Connexion à votre compte
    </template>
    
    <template #subtitle>
      Connectez-vous pour gérer vos groupes
    </template>
    
    <LoginForm
      :loading="authStore.isLoading"
      :global-error="authStore.error"
      @submit="handleLogin"
    />
    
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/domain/stores/authStore'
import AuthLayout from '@/presentation/layouts/AuthLayout.vue'
import LoginForm from '@/presentation/components/molecules/LoginForm.vue'
import type { LoginPayload } from '@/shared/types/api'

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async (payload: LoginPayload) => {
  const result = await authStore.login(payload)
  
  if (result.success) {
    router.push('/groups')
  }
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
</style>