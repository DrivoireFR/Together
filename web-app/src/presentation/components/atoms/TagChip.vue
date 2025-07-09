<template>
  <button
    :class="chipClasses"
    :style="chipStyles"
    @click="$emit('click')"
  >
    <span class="tag-label">{{ tag.label }}</span>
    <span v-if="tasksCount > 0" class="tasks-count">{{ tasksCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '@/shared/types/api'

interface Props {
  tag: Tag
  tasksCount?: number
  isSelected?: boolean
  variant?: 'default' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  tasksCount: 0,
  isSelected: false,
  variant: 'default',
  size: 'md'
})

defineEmits<{
  click: []
}>()

const chipClasses = computed(() => [
  'tag-chip',
  `tag-chip--${props.variant}`,
  `tag-chip--${props.size}`,
  {
    'tag-chip--selected': props.isSelected,
    'tag-chip--clickable': true
  }
])

const chipStyles = computed(() => {
  const color = props.tag.color
  
  if (props.variant === 'outlined') {
    return {
      borderColor: color,
      color: color,
      backgroundColor: props.isSelected ? `${color}20` : 'transparent'
    }
  }
  
  if (props.variant === 'ghost') {
    return {
      backgroundColor: `${color}20`,
      color: color
    }
  }
  
  // Default variant
  return {
    backgroundColor: props.isSelected ? color : `${color}40`,
    color: props.isSelected ? '#fff' : '#000',
    borderColor: color
  }
})
</script>

<style scoped>
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  border: 1px solid;
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  transition: all 0.15s ease;
  cursor: pointer;
  outline: none;
}

.tag-chip--sm {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
}

.tag-chip--md {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.tag-chip--lg {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
}

.tag-chip--clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tag-chip--clickable:active {
  transform: translateY(0);
}

.tag-chip--selected {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tag-label {
  white-space: nowrap;
}

.tasks-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 var(--spacing-1);
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.tag-chip--outlined .tasks-count,
.tag-chip--ghost .tasks-count {
  background: rgba(0, 0, 0, 0.1);
}
</style>