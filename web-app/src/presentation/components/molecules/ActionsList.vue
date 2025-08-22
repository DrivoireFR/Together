<template>
  <div class="actions-list">
    <div class="actions-list-header">
      <h3 class="actions-title">Activité récente</h3>
      <span class="actions-count">{{ actions.length }} action{{ actions.length > 1 ? 's' : '' }}</span>
    </div>
    
    <div class="actions-content" v-if="actions.length > 0">
      <ActionCard
        v-for="action in actions"
        :key="action.id"
        :action="action"
      />
    </div>
    
    <div class="empty-state" v-else>
      <div class="empty-icon">📋</div>
      <p class="empty-message">Aucune action pour le moment</p>
      <p class="empty-description">Les actions apparaîtront ici quand les membres du groupe commenceront à accomplir des tâches.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Action } from '@/domain/types'
import ActionCard from '@/presentation/components/atoms/ActionCard.vue'

interface Props {
  actions: Action[]
}

defineProps<Props>()
</script>

<style scoped>
.actions-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.actions-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-white);
}

.actions-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.actions-count {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  background: var(--color-gray-100);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
}

.actions-content {
  flex: 1;
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  overflow-y: auto;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8) var(--spacing-4);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-4);
  opacity: 0.5;
}

.empty-message {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin: 0 0 var(--spacing-2) 0;
}

.empty-description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0;
  line-height: 1.5;
  max-width: 280px;
}
</style> 