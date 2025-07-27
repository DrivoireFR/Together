<template>
  <div class="task-list">
    <div class="task-list-header">
      <h3 class="task-list-title">
        {{ title }}
        <span class="tasks-count">({{ filteredTasks.length }})</span>
      </h3>
      <div class="task-list-actions">
        <slot name="actions" />
      </div>
    </div>
    
    <div class="task-grid" v-if="filteredTasks.length > 0">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :show-actions="showActions"
        :variant="cardVariant"
        @edit="$emit('task-edit', task)"
        @delete="$emit('task-delete', task)"
        @click="$emit('task-click', task)"
      />
    </div>
    
    <div class="empty-state" v-else>
      <div class="empty-icon">📝</div>
      <p class="empty-message">{{ emptyMessage }}</p>
      <p class="empty-description">{{ emptyDescription }}</p>
      <slot name="empty-actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task, Tag } from '@/shared/types/api'
import TaskCard from '@/presentation/components/atoms/TaskCard.vue'

interface Props {
  tasks: Task[]
  selectedTag?: Tag | null
  showActions?: boolean
  cardVariant?: 'default' | 'compact'
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false,
  cardVariant: 'default',
  title: 'Tâches'
})

defineEmits<{
  'task-edit': [task: Task]
  'task-delete': [task: Task]
  'task-click': [task: Task]
}>()

const filteredTasks = computed(() => {
  if (!props.selectedTag) {
    return props.tasks
  }
  return props.tasks.filter(task => task.tag?.id === props.selectedTag!.id)
})

const emptyMessage = computed(() => {
  if (props.selectedTag) {
    return `Aucune tâche avec le tag "${props.selectedTag.label}"`
  }
  return 'Aucune tâche disponible'
})

const emptyDescription = computed(() => {
  if (props.selectedTag) {
    return 'Essayez de sélectionner un autre tag ou de créer une nouvelle tâche avec ce tag'
  }
  return 'Créez votre première tâche pour commencer à organiser votre travail'
})
</script>

<style scoped>
.task-list {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
}

.task-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.task-list-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.tasks-count {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-gray-500);
}

.task-list-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-4);
}

.task-grid--compact {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-3);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-4);
  opacity: 0.5;
}

.empty-message {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin: 0 0 var(--spacing-2) 0;
}

.empty-description {
  font-size: var(--font-size-base);
  color: var(--color-gray-500);
  margin: 0 0 var(--spacing-4) 0;
  line-height: 1.5;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .task-grid {
    grid-template-columns: 1fr;
  }
  
  .task-list-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-3);
  }
  
  .task-list-title {
    justify-content: center;
  }
}
</style>