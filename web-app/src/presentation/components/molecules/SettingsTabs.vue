<template>
  <div class="settings-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      class="tab"
      :class="{ 'tab--active': isActive(tab) }"
      type="button"
      @click="goTo(tab)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface TabConfig {
  name: string
  label: string
}

const route = useRoute()
const router = useRouter()

const groupId = computed(() => route.params.id as string)

const tabs: TabConfig[] = [
  { name: 'GroupSettingsGroup', label: 'Le groupe' },
  { name: 'GroupSettingsAccount', label: 'Compte' }
]

const isActive = (tab: TabConfig) => route.name === tab.name

const goTo = (tab: TabConfig) => {
  router.push({
    name: tab.name,
    params: { id: groupId.value }
  })
}
</script>

<style scoped>
.settings-tabs {
  display: inline-flex;
  padding: 0.25rem;
  border-radius: var(--border-radius-full);
  background: var(--color-gray-100);
  gap: 0.25rem;
}

.tab {
  border: none;
  background: transparent;
  padding: 0.5rem 1.25rem;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tab--active {
  background: var(--color-white);
  color: var(--color-primary);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}

.tab:hover:not(.tab--active) {
  background: var(--color-gray-200);
}
</style>

