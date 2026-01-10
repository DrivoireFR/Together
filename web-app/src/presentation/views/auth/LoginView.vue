<template>
  <AuthLayout>
    <template #title>
      Connexion à votre compte
    </template>
    
    <template #subtitle>
      Connectez-vous pour gérer vos groupes
    </template>
    
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
import AuthLayout from '@/presentation/layouts/AuthLayout.vue'
import LoginForm from '@/presentation/components/molecules/LoginForm.vue'
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