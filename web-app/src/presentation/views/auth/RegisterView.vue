<template>
  <AuthLayout>
    <template #title>
      Créer votre compte
    </template>
    
    <template #subtitle>
      Inscrivez-vous pour rejoindre des groupes
    </template>
    
    <RegisterForm />
    
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
import type { RegisterPayload } from '@/domain/types'


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