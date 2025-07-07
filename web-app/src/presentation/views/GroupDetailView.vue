<template>
  <AppLayout>
    <div class="group-detail-container">
      <div v-if="groupStore.isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement du groupe...</p>
      </div>
      
      <div v-else-if="groupStore.currentGroup" class="group-content">
        <h1 class="group-title">{{ groupStore.currentGroup.nom }}</h1>
        <p class="group-description">Détails du groupe - À implémenter</p>
      </div>
      
      <div v-else class="error-state">
        <h3 class="error-title">Groupe non trouvé</h3>
        <p class="error-description">Ce groupe n'existe pas ou vous n'y avez pas accès</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import AppLayout from '@/presentation/layouts/AppLayout.vue'

const route = useRoute()
const groupStore = useGroupStore()

onMounted(async () => {
  const groupId = Number(route.params.id)
  if (groupId) {
    await groupStore.fetchGroupById(groupId)
  }
})
</script>

<style scoped>
.group-detail-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-8) 0;
}

.loading-spinner {
  width: var(--spacing-8);
  height: var(--spacing-8);
  border: 2px solid var(--color-primary);
  border-top-color: transparent;
  border-radius: var(--border-radius-full);
  margin: 0 auto var(--spacing-2);
  animation: spin 1s linear infinite;
}

.loading-text {
  margin: 0;
  color: var(--color-gray-500);
}

.group-content h1 {
  margin: 0;
}

.group-content p {
  margin: 0;
}

.group-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
}

.group-description {
  color: var(--color-gray-600);
}

.error-state {
  text-align: center;
  padding: var(--spacing-12) 0;
}

.error-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-2) 0;
}

.error-description {
  color: var(--color-gray-500);
  margin: 0;
}
</style>