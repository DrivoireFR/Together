<template>
  <div class="progress-container">
    <div v-if="showLabel" class="progress-header">
      <span class="progress-label">{{ label }}</span>
      <span class="progress-value">{{ formattedValue }}</span>
    </div>
    
    <div class="progress-track" :class="[`progress-track--${size}`, `progress-track--${variant}`]">
      <div 
        class="progress-fill" 
        :class="[`progress-fill--${variant}`, { 'progress-fill--animated': animated }]"
        :style="{ width: `${clampedPercentage}%` }"
      />
    </div>
    
    <div v-if="showDetails" class="progress-details">
      <span class="progress-current">{{ current }}</span>
      <span class="progress-separator">/</span>
      <span class="progress-total">{{ total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  current: number
  total: number
  label?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showDetails?: boolean
  showPercentage?: boolean
  animated?: boolean
  precision?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  variant: 'primary',
  size: 'md',
  showLabel: true,
  showDetails: false,
  showPercentage: true,
  animated: true,
  precision: 0
})

const percentage = computed(() => {
  if (props.total === 0) return 0
  return (props.current / props.total) * 100
})

const clampedPercentage = computed(() => {
  return Math.max(0, Math.min(100, percentage.value))
})

const formattedValue = computed(() => {
  if (props.showPercentage) {
    return `${percentage.value.toFixed(props.precision)}%`
  }
  return `${props.current}/${props.total}`
})
</script>

<style scoped>
.progress-container {
  width: 100%;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.progress-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.progress-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  font-size: var(--font-size-sm);
}

.progress-track {
  background-color: var(--color-gray-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  position: relative;
}

.progress-track--sm {
  height: 4px;
}

.progress-track--md {
  height: 8px;
}

.progress-track--lg {
  height: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: var(--border-radius-full);
  transition: width 0.3s ease-in-out;
}

.progress-fill--animated {
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-fill--primary {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
}

.progress-fill--success {
  background: linear-gradient(90deg, var(--color-success), var(--color-success-light));
}

.progress-fill--warning {
  background: linear-gradient(90deg, var(--color-warning), var(--color-warning-light));
}

.progress-fill--danger {
  background: linear-gradient(90deg, var(--color-danger), var(--color-danger-light));
}

.progress-fill--info {
  background: linear-gradient(90deg, var(--color-info), var(--color-info-light));
}

.progress-details {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--spacing-1);
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.progress-current {
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
}

.progress-separator {
  margin: 0 var(--spacing-1);
}

.progress-total {
  color: var(--color-gray-500);
}

/* Variantes de couleur pour la track */
.progress-track--success {
  background-color: var(--color-success-light);
}

.progress-track--warning {
  background-color: var(--color-warning-light);
}

.progress-track--danger {
  background-color: var(--color-danger-light);
}

.progress-track--info {
  background-color: var(--color-info-light);
}
</style> 