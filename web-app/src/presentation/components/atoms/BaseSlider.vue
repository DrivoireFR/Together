<template>
  <div class="slider-container">
    <div v-if="showLabel" class="slider-header">
      <label :for="id" class="slider-label">{{ label }}</label>
      <span class="slider-value">{{ displayValue }}</span>
    </div>
    
    <div class="slider-wrapper">
      <!-- Étiquettes visuelles -->
      <div class="slider-labels">
        <span class="label-start">{{ startLabel }}</span>
        <span class="label-end">{{ endLabel }}</span>
      </div>
      
      <!-- Slider principal -->
      <div class="slider-track-container">
        <input
          :id="id"
          v-model.number="internalValue"
          type="range"
          :min="min"
          :max="max"
          :step="step"
          class="slider-input"
          :class="{ 'slider-input--error': error }"
          @input="handleInput"
        />
        
        <!-- Track visuel personnalisé -->
        <div class="slider-track">
          <div 
            class="slider-progress" 
            :style="{ width: progressPercentage + '%' }"
          />
        </div>
        
        <!-- Thumb personnalisé -->
        <div 
          class="slider-thumb" 
          :style="{ left: progressPercentage + '%' }"
        >
          <span class="thumb-value">{{ internalValue }}</span>
        </div>
        
        <!-- Indicateurs de niveau -->
        <div class="slider-indicators">
          <div 
            v-for="i in indicatorCount" 
            :key="i"
            class="indicator"
            :class="{ 'indicator--active': i <= internalValue }"
          />
        </div>
      </div>
    </div>
    
    <span v-if="error" class="slider-error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { difficultyDescriptions } from '@/shared/constants'
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: number
  id?: string
  label?: string
  min?: number
  max?: number
  step?: number
  startLabel?: string
  endLabel?: string
  showLabel?: boolean
  showDescription?: boolean
  descriptions?: string[]
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: 'slider',
  label: '',
  min: 1,
  max: 10,
  step: 1,
  startLabel: 'Facile',
  endLabel: 'Difficile',
  showLabel: true,
  showDescription: true,
  descriptions: () => difficultyDescriptions
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [value: number]
}>()

const internalValue = ref(props.modelValue)

const progressPercentage = computed(() => {
  return ((internalValue.value - props.min) / (props.max - props.min)) * 100
})

const indicatorCount = computed(() => {
  return props.max - props.min + 1
})

const displayValue = computed(() => {
  return `${internalValue.value}/${props.max}`
})

const currentDescription = computed(() => {
  const index = internalValue.value - props.min
  return props.descriptions[index] || `Niveau ${internalValue.value}`
})

const handleInput = () => {
  emit('update:modelValue', internalValue.value)
  emit('change', internalValue.value)
}

// Synchroniser avec le modelValue parent
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})
</script>

<style scoped>
.slider-container {
  width: 100%;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.slider-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.slider-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
}

.slider-wrapper {
  position: relative;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-2);
}

.label-start,
.label-end {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  font-weight: var(--font-weight-medium);
}

.slider-track-container {
  position: relative;
  height: 3rem;
  margin: var(--spacing-2) 0;
}

.slider-input {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 8px;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.slider-input--error {
  /* Les erreurs seront gérées visuellement par le container */
}

.slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.slider-progress {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--color-green-400) 0%, 
    var(--color-yellow-400) 50%, 
    var(--color-red-400) 100%
  );
  border-radius: var(--border-radius-full);
  transition: width 0.2s ease;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  background: var(--color-white);
  border: 3px solid var(--color-primary);
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.slider-thumb:hover {
  transform: translate(-50%, -50%) scale(1.1);
  border-color: var(--color-primary-dark);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.thumb-value {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.slider-indicators {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  padding: 0 0.25rem;
}

.indicator {
  width: 4px;
  height: 4px;
  border-radius: var(--border-radius-full);
  background: var(--color-gray-300);
  transition: all 0.2s ease;
}

.indicator--active {
  background: var(--color-primary);
  transform: scale(1.2);
}

.slider-description {
  text-align: center;
  margin-top: var(--spacing-2);
}

.description-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  background: var(--color-gray-50);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  display: inline-block;
}

.slider-error {
  display: block;
  margin-top: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--color-red-500);
}

/* États d'erreur */
.slider-container:has(.slider-input--error) .slider-track {
  background: var(--color-red-100);
}

.slider-container:has(.slider-input--error) .slider-progress {
  background: var(--color-red-400);
}

.slider-container:has(.slider-input--error) .slider-thumb {
  border-color: var(--color-red-500);
}

/* Responsive */
@media (max-width: 640px) {
  .slider-thumb {
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .thumb-value {
    font-size: var(--font-size-xs);
  }
  
  .slider-labels {
    font-size: var(--font-size-xs);
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .slider-progress,
  .slider-thumb,
  .indicator {
    transition: none;
  }
}
</style> 