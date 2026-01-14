<template>
  <div class="account-view">
    <h2 class="account-title">Compte</h2>

    <div class="account-actions">
      <BaseButton
        variant="danger"
        @click="handleLogout"
      >
        Déconnexion
      </BaseButton>

      <BaseButton
        variant="outline"
        @click="goToPassword"
      >
        Changer de mot de passe
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/domain/stores/authStore'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const goToPassword = () => {
  const { id } = router.currentRoute.value.params
  router.push({
    name: 'GroupSettingsPassword',
    params: { id }
  })
}
</script>

<style scoped>
.account-view {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.account-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-4) 0;
}

.account-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}
</style>

