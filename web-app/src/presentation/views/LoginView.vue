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
        class="text-blue-600 hover:text-blue-500 text-sm font-medium"
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