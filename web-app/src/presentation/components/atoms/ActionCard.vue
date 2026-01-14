<template>
  <div class="action-card">
    <div class="action-content">
      <div class="action-task">
        <Avatar :avatar="props.action.user.avatar" :username="userDisplayName"/>
        <h4 class="task-title">{{ action.task.label }}</h4>
      </div>
      <div class="action-meta">
        <span class="user-name">{{ userDisplayName }}</span>
        <span class="action-time">{{ formatTime(action.createdAt) }}</span>
      </div>
    </div>

    <div v-if="isCurrentUser" class="action-actions">
      <BaseButton
        variant="danger"
        size="sm"
        @click="onDelete"
        class="delete-button"
        title="Supprimer cette action"
      >
        🗑️
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Action } from '@/domain/types'
import { useAuthStore } from '@/domain/stores/authStore'
import { useTasksStore } from '@/domain/stores/tasksStore'
import Avatar from './Avatar.vue'
import BaseButton from './BaseButton.vue'

interface Props {
  action: Action
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const taskStore = useTasksStore()

const isCurrentUser = computed(() => {
  return authStore.user?.id === props.action.user.id
})

const userDisplayName = computed(() => {
  return isCurrentUser.value ? 'Vous' : props.action.user.nom
})

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'À l\'instant'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}min`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}h`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days}j`
  }
}

function onDelete() {
  taskStore.deleteAction(props.action.id)
}
</script>

<style scoped>
.action-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-md);
  transition: all 0.15s ease;
  position: relative;
}

.action-card:hover {
  border-color: var(--color-gray-300);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.action-task {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.task-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0;
  flex: 1;
}

.action-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.user-name {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
}

.action-time {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.action-icon {
  flex-shrink: 0;
  width: var(--spacing-6);
  height: var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-50);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
}

.default-icon {
  color: var(--color-green-500);
}

.action-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  margin-left: var(--spacing-2);
}

.delete-button {
  transition: opacity 0.2s ease;
  padding: var(--spacing-1);
  width: auto;
  height: auto;
  min-width: auto;
}

.delete-button:hover {
  background: var(--color-red-50);
  color: var(--color-red-600);
  transform: scale(1.1);
}
</style> 