<template>
  <div class="action-card">
    <div class="action-content">
      <div class="action-task">
        <h4 class="task-title">{{ action.task.label }}</h4>
                 <TagChip
           v-if="action.task.tag"
           :tag="action.task.tag"
           variant="ghost"
           size="sm"
         />
      </div>
      <div class="action-meta">
        <span class="user-name">{{ action.user.nom }}</span>
        <span class="action-time">{{ formatTime(action.createdAt) }}</span>
      </div>
    </div>
    <div class="action-icon">
      <span v-if="action.task.iconUrl">{{ action.task.iconUrl }}</span>
      <span v-else class="default-icon">✅</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Action } from '@/shared/types/api'
import TagChip from './TagChip.vue'

interface Props {
  action: Action
}

const props = defineProps<Props>()

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
</style> 