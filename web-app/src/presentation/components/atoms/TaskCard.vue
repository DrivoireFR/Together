<template>
  <div :class="[cardClasses, 'task-card-clickable', { 'task-card--loading': isLoading }]">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="task-loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Traitement...</p>
    </div>
    
    <div class="task-header">
      <div class="task-icon" v-if="task.iconUrl">
        <img :src="task.iconUrl" :alt="task.label" />
      </div>
      <div class="task-info">
        <h3 class="task-title">{{ task.label }}</h3>
        <div class="task-meta">
          <div class="task-frequency">
            {{ frequencyText }}
          </div>
          <div class="difficulty-indicator" :class="difficultyClass">
            <span class="difficulty-emoji">{{ difficultyEmoji }}</span>
            <span class="difficulty-text">{{ difficultyText }}</span>
            <span class="difficulty-points">{{ task.points }}</span>
          </div>
        </div>
      </div>
      <div class="task-indicators">
        <div v-if="task.hurryState" class="hurry-indicator" :class="hurryClass">
          <span class="hurry-icon">{{ hurryIcon }}</span>
        </div>
        <TagChip 
          v-if="task.tag" 
          :tag="task.tag" 
          variant="ghost" 
          size="sm"
        />
      </div>
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

    <div class="main-action">
      <BaseButton 
        variant="primary" 
        size="lg" 
        @click.stop="$emit('click')"
        color="danger"
        :disabled="isLoading"
        >
        <span v-if="!isLoading">C'est fait !</span>
        <span v-else>Traitement...</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task, Tag, HurryState } from '@/domain/types'
import { difficultyDescriptions } from '@/shared/constants'
import { useTasksStore } from '@/domain/stores/tasksStore'
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

const tasksStore = useTasksStore()

const isLoading = computed(() => tasksStore.isTaskLoading(props.task.id))

defineEmits<{
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

const difficultyText = computed(() => {
  const index = Math.min(Math.max(props.task.points - 1, 0), difficultyDescriptions.length - 1)
  return difficultyDescriptions[index] || 'Moyen'
})

const difficultyEmoji = computed(() => {
  const points = props.task.points
  if (points <= 2) return '😎'
  if (points <= 4) return '🙂'
  if (points <= 6) return '😐'
  if (points <= 8) return '😖'
  return '😵‍💫'
})

const difficultyClass = computed(() => {
  const points = props.task.points
  if (points <= 3) return 'difficulty--easy'
  if (points <= 6) return 'difficulty--medium'
  return 'difficulty--hard'
})

const hurryIcon = computed(() => {
  const hurryState = props.task.hurryState
  switch (hurryState) {
    case 'no':
      return '😌' // Relaxed face - not urgent
    case 'maybe':
      return '⚠️' // Warning sign - maybe urgent
    case 'yes':
      return '🚨' // Alarm - urgent
    default:
      return ''
  }
})

const hurryClass = computed(() => {
  const hurryState = props.task.hurryState
  switch (hurryState) {
    case 'no':
      return 'hurry--no'
    case 'maybe':
      return 'hurry--maybe'
    case 'yes':
      return 'hurry--yes'
    default:
      return ''
  }
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

.task-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.task-frequency {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: 1.25;
}

.difficulty-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  width: fit-content;
  transition: all 0.2s ease;
}

.difficulty--easy {
  background: var(--color-green-100);
  color: var(--color-green-700);
  border: 1px solid var(--color-green-200);
}

.difficulty--medium {
  background: var(--color-yellow-100);
  color: var(--color-yellow-700);
  border: 1px solid var(--color-yellow-200);
}

.difficulty--hard {
  background: var(--color-red-100);
  color: var(--color-red-700);
  border: 1px solid var(--color-red-200);
}

.difficulty-emoji {
  font-size: var(--font-size-sm);
  line-height: 1;
}

.difficulty-text {
  font-weight: var(--font-weight-medium);
}

.difficulty-points {
  background: rgba(255, 255, 255, 0.8);
  padding: 0 var(--spacing-1);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xs);
}

.task-actions {
  display: flex;
  justify-content: space-around;
  gap: var(--spacing-2);
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--color-gray-100);
}

.task-actions .btn {
  flex: 1;
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

.main-action {
  padding: 5px 0;
  width: 100%;
  justify-content: center;
  display: flex;
}

.task-indicators {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

.hurry-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
}

.hurry--no {
  background: var(--color-green-100);
  border: 1px solid var(--color-green-200);
}

.hurry--maybe {
  background: var(--color-yellow-100);
  border: 1px solid var(--color-yellow-200);
}

.hurry--yes {
  background: var(--color-red-100);
  border: 1px solid var(--color-red-200);
  animation: pulse 1.5s infinite;
}

.hurry-icon {
  line-height: 1;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .task-meta {
    gap: var(--spacing-2);
  }
  
  .difficulty-indicator {
    gap: var(--spacing-1);
    padding: 2px var(--spacing-1);
  }
  
  .difficulty-text {
    display: none; /* Cache le texte sur mobile, garde juste emoji + points */
  }
  
  .task-card--compact .difficulty-indicator {
    padding: 1px var(--spacing-1);
  }
  
  .task-card--compact .difficulty-points {
    padding: 0 2px;
  }
  
  .hurry-indicator {
    width: 1.5rem;
    height: 1.5rem;
    font-size: var(--font-size-xs);
  }
}

.main-action .btn {
  width: 100%;
}

.task-card--loading {
  position: relative;
  pointer-events: none;
}

.task-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  border-radius: var(--border-radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  gap: var(--spacing-2);
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>