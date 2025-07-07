<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <div class="btn-content">
      <!-- Loading spinner -->
      <svg
        v-if="loading"
        class="btn-spinner"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      
      <!-- Icon avant le texte -->
      <component
        v-if="iconBefore && !loading"
        :is="iconBefore"
        class="btn-icon btn-icon-before"
      />
      
      <!-- Contenu du bouton -->
      <slot />
      
      <!-- Icon après le texte -->
      <component
        v-if="iconAfter && !loading"
        :is="iconAfter"
        class="btn-icon btn-icon-after"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  iconBefore?: any
  iconAfter?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  return [
    'btn',
    `btn--${props.variant}`,
    `btn--${props.size}`
  ].join(' ')
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-md);
  transition: var(--transition-fast);
  transition-property: color, background-color, border-color, box-shadow;
  border: var(--border-width) solid transparent;
  cursor: pointer;
  outline: none;
  text-decoration: none;
}

.btn:focus {
  box-shadow: 0 0 0 2px var(--color-white), 0 0 0 4px var(--color-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon {
  width: var(--spacing-4);
  height: var(--spacing-4);
  flex-shrink: 0;
}

.btn-icon-before {
  margin-right: var(--spacing-2);
}

.btn-icon-after {
  margin-left: var(--spacing-2);
}

.btn-spinner {
  width: var(--spacing-4);
  height: var(--spacing-4);
  margin-right: var(--spacing-2);
  animation: spin 1s linear infinite;
}

/* Sizes */
.btn--sm {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.btn--md {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}

.btn--lg {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
}

/* Variants */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn--secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-hover);
}

.btn--danger {
  background-color: var(--color-danger);
  color: var(--color-white);
}

.btn--danger:hover:not(:disabled) {
  background-color: var(--color-danger-hover);
}

.btn--outline {
  border-color: var(--color-gray-300);
  background-color: transparent;
  color: var(--color-gray-700);
}

.btn--outline:hover:not(:disabled) {
  background-color: var(--color-gray-50);
}

.btn--outline:focus {
  box-shadow: 0 0 0 2px var(--color-white), 0 0 0 4px var(--color-primary);
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-gray-700);
}

.btn--ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100);
}

.btn--ghost:focus {
  box-shadow: 0 0 0 2px var(--color-white), 0 0 0 4px var(--color-primary);
}
</style>