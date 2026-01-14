<template>
  <div class="password-view">
    <div class="password-view-header">
      <h2 class="password-view-title">Changer de mot de passe</h2>
      <button
        type="button"
        class="back-button"
        @click="goBackToProfile"
      >
        <ArrowLeftCircleIcon color="black" />
      </button>
    </div>

    <PasswordChangeForm />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline'
import PasswordChangeForm from '@/presentation/components/molecules/PasswordChangeForm.vue'

const router = useRouter()

const goBackToProfile = () => {
  router.back()
}
</script>

<style scoped>
.password-view {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.password-view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
}

.back-button {
  width: 3rem;
  align-self: flex-start;
  border: none;
  background: transparent;
  color: black;
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: 0;
}

.back-button:hover {
  text-decoration: underline;
}

.password-view-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}
</style>

