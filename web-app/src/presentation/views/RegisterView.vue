<template>
  <AuthLayout>
    <template #title>
      Créer votre compte
    </template>
    
    <template #subtitle>
      Inscrivez-vous pour rejoindre des groupes
    </template>
    
    <RegisterForm
      :loading="authStore.isLoading"
      :global-error="authStore.error"
      @submit="handleRegister"
    />
    
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/domain/stores/authStore'
import AuthLayout from '@/presentation/layouts/AuthLayout.vue'
import RegisterForm from '@/presentation/components/molecules/RegisterForm.vue'
import type { RegisterPayload } from '@/shared/types/api'

const router = useRouter()
const authStore = useAuthStore()

const handleRegister = async (payload: RegisterPayload) => {
  const result = await authStore.register(payload)
  
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