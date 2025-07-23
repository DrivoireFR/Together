<template>
  <div class="user-stats-card">
    <div class="user-stats-header">
      <h3 class="stats-title">Actions par utilisateur</h3>
      <span class="stats-count">{{ Object.keys(userStats).length }} membre{{ Object.keys(userStats).length > 1 ? 's' : '' }}</span>
    </div>
    
    <div class="user-stats-list" v-if="Object.keys(userStats).length > 0">
      <div 
        v-for="(count, userId) in sortedUserStats" 
        :key="userId"
        class="user-stat-item"
      >
        <div class="user-info">
          <div class="user-avatar">
            {{ getUserInitials(userId) }}
          </div>
          <span class="user-name">{{ getUserName(userId) }}</span>
        </div>
        <div class="user-actions">
          <span class="action-count">{{ count }}</span>
          <span class="action-label">action{{ count > 1 ? 's' : '' }}</span>
        </div>
      </div>
    </div>
    
    <div class="empty-state" v-else>
      <p class="empty-message">Aucune action enregistrée</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Action } from '@/shared/types/api'

interface Props {
  userStats: Record<number, number>
  actions: Action[]
}

const props = defineProps<Props>()

const sortedUserStats = computed(() => {
  return Object.fromEntries(
    Object.entries(props.userStats)
      .sort(([,a], [,b]) => b - a)
  )
})

const getUserName = (userId: string | number) => {
  const user = props.actions.find(action => action.user.id === Number(userId))?.user
  return user ? user.nom : `Utilisateur ${userId}`
}

const getUserInitials = (userId: string | number) => {
  const user = props.actions.find(action => action.user.id === Number(userId))?.user
  if (user && user.nom) {
    return user.nom.substring(0, 2).toUpperCase()
  }
  return 'U'
}
</script>

<style scoped>
.user-stats-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.user-stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
}

.stats-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.stats-count {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  background: var(--color-white);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
}

.user-stats-list {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.user-stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-md);
  transition: all 0.15s ease;
}

.user-stat-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-50, #eff6ff);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--color-primary);
  color: white;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.user-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.action-count {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.action-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.empty-state {
  padding: var(--spacing-8);
  text-align: center;
}

.empty-message {
  color: var(--color-gray-500);
  margin: 0;
}
</style> 