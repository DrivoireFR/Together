<template>
  <button
    :class="chipClasses"
    :style="chipStyles"
    @click="$emit('click')"
  >
    <span v-if="tasksCount > 0" class="tasks-count">{{ tasksCount }}</span>
    <div v-if="tag.icon" class="tag-icon">
      <Icon :icon="tag.icon" />
    </div>
    <span class="tag-label">{{ tag.label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '@/domain/types'
import Icon from '@/presentation/components/atoms/Icon.vue'

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
  border: 1px solid;
  aspect-ratio: 1/1;
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

.tag-icon {
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tag-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.tasks-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  height: 2em;
  width: 2em;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.tag-chip--outlined .tasks-count,
.tag-chip--ghost .tasks-count {
  background: rgba(0, 0, 0, 0.1);
}
</style>