<template>
  <div :class="cardClasses" @click="$emit('click')" class="task-card-clickable">
    <div class="task-header">
      <div class="task-icon" v-if="task.iconUrl">
        <img :src="task.iconUrl" :alt="task.label" />
      </div>
      <div class="task-info">
        <h3 class="task-title">{{ task.label }}</h3>
        <div class="task-frequency">
          {{ frequencyText }}
        </div>
      </div>
      <TagChip 
        v-if="task.tag" 
        :tag="task.tag" 
        variant="ghost" 
        size="sm"
        @click="$emit('tag-click', task.tag)"
      />
    </div>
    
    <div class="task-actions" v-if="showActions">
      <BaseButton 
        variant="ghost" 
        size="sm" 
        @click.stop="$emit('edit')"
      >
        Modifier
      </BaseButton>
      <BaseButton 
        variant="ghost" 
        size="sm" 
        @click.stop="$emit('delete')"
        color="danger"
      >
        Supprimer
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task, Tag } from '@/shared/types/api'
import TagChip from './TagChip.vue'
import BaseButton from './BaseButton.vue'

interface Props {
  task: Task
  showActions?: boolean
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false,
  variant: 'default'
})

defineEmits<{
  'tag-click': [tag: Tag]
  edit: []
  delete: []
  click: []
}>()

const cardClasses = computed(() => [
  'task-card',
  `task-card--${props.variant}`
])

const frequencyText = computed(() => {
  const { frequenceEstimee, uniteFrequence } = props.task
  const unit = uniteFrequence === 'jour' ? 'jour' : 
               uniteFrequence === 'semaine' ? 'semaine' : 'mois'
  
  if (frequenceEstimee === 1) {
    return `1 fois par ${unit}`
  }
  
  return `${frequenceEstimee} fois par ${unit}`
})
</script>

<style scoped>
.task-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  transition: all 0.15s ease;
}

.task-card:hover {
  border-color: var(--color-gray-300);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-card-clickable {
  cursor: pointer;
}

.task-card-clickable:hover {
  transform: translateY(-2px);
}

.task-card--compact {
  padding: var(--spacing-3);
}

.task-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.task-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-1) 0;
  line-height: 1.25;
}

.task-frequency {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: 1.25;
}

.task-actions {
  display: flex;
  gap: var(--spacing-2);
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--color-gray-100);
}

.task-card--compact .task-header {
  margin-bottom: var(--spacing-2);
}

.task-card--compact .task-icon {
  width: 2rem;
  height: 2rem;
}

.task-card--compact .task-title {
  font-size: var(--font-size-sm);
}

.task-card--compact .task-frequency {
  font-size: var(--font-size-xs);
}
</style>