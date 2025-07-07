<template>
  <div class="auth-layout">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <div class="logo-icon">
          <UserGroupIcon class="logo-svg" />
        </div>
      </div>
      
      <!-- Title -->
      <h2 class="auth-title">
        <slot name="title">Connexion</slot>
      </h2>
      
      <!-- Subtitle -->
      <p v-if="$slots.subtitle" class="auth-subtitle">
        <slot name="subtitle" />
      </p>
    </div>

    <div class="auth-form-container">
      <BaseCard>
        <slot />
      </BaseCard>
      
      <!-- Footer links -->
      <div v-if="$slots.footer" class="auth-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import BaseCard from '@/presentation/components/atoms/BaseCard.vue'
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: var(--color-gray-50);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-12) 0;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.auth-logo {
  display: flex;
  justify-content: center;
}

.logo-icon {
  width: var(--spacing-12);
  height: var(--spacing-12);
  background-color: var(--color-primary);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-svg {
  width: var(--spacing-8);
  height: var(--spacing-8);
  color: var(--color-white);
}

.auth-title {
  margin-top: var(--spacing-6);
  text-align: center;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
}

.auth-subtitle {
  margin-top: var(--spacing-2);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.auth-form-container {
  margin-top: var(--spacing-8);
  width: 100%;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
  padding: 0 var(--spacing-6);
}

.auth-footer {
  margin-top: var(--spacing-6);
  text-align: center;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .auth-container {
    padding: 0;
  }
  
  .auth-form-container {
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .auth-layout {
    padding: var(--spacing-8) var(--spacing-8);
  }
}
</style>