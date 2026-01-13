<template>
    <button
      :class="chipClasses"
      :style="chipStyles"
      @click="$emit('click')"
    >
      <div class="options" @click="onOptionClick">
        <IconComp :icon="Icon.Options" />
      </div>

      <span v-if="tasksCount > 0" class="tasks-count">{{ tasksCount }}</span>
      <div v-if="tag.icon" class="tag-icon">
        <IconComp :icon="tag.icon" />
      </div>
      <span class="tag-label">{{ tag.label }}</span>
      <div v-if="showOverlay" class="overlay" @click.self="closeOverlay">
        <button class="overlay-button overlay-button--top" @click="onModify">
          Modifier
        </button>
        <button class="overlay-button overlay-button--bottom" @click="onDelete">
          Supprimer
        </button>
      </div>
    </button>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { Tag } from '@/domain/types'
import IconComp from '@/presentation/components/atoms/Icon.vue'
import { Icon } from '@/shared/types/enums'
import { useTasksStore } from '@/domain/stores/tasksStore'

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

const emit = defineEmits<{
  click: []
  modify: []
}>()

const tasksStore = useTasksStore()
const showOverlay = ref(false)

const chipClasses = computed(() => [
  'tag-chip',
  `tag-chip--${props.variant}`,
  `tag-chip--${props.size}`,
  {
    'tag-chip--selected': props.isSelected,
    'tag-chip--clickable': true
  }
])

function onOptionClick(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  showOverlay.value = !showOverlay.value
}

function closeOverlay() {
  showOverlay.value = false
}

function onModify(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  emit('modify')
  closeOverlay()
}

function onDelete(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  tasksStore.deleteTag(props.tag)
  closeOverlay()
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (showOverlay.value && !target.closest('.tag-button-wrapper')) {
    closeOverlay()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

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
  position: relative;
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
  --icon-color: v-bind('tag.color');
  width: 3rem;
  height: 3rem;
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
  position: absolute;
  top: 3px;
  left: 3px;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  height: 2em;
  width: 2em;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.options {
  position: absolute;
  z-index: 10;
  top: 3px;
  right: 3px;
  width: 40px;
  height: 40px;
}

.tag-button-wrapper {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.overlay-button {
  flex: 1;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
}

.overlay-button--top {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--color-primary, #007bff);
}

.overlay-button--top:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.overlay-button--bottom {
  color: var(--color-danger, #dc3545);
}

.overlay-button--bottom:hover {
  background-color: rgba(220, 53, 69, 0.1);
}
</style>