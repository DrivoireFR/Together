<template>
  <div class="group-settings">
    <div class="group-settings-header">
      <h2 class="group-settings-title">Paramètres</h2>
      <SettingsTabs />
    </div>

    <div class="group-settings-content">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import SettingsTabs from '@/presentation/components/molecules/SettingsTabs.vue'
</script>

<style scoped>
.group-settings {
  max-width: 48rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.group-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
}

.group-settings-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.group-settings-content {
  flex: 1;
}
</style>
