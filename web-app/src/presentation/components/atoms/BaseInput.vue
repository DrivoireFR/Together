<template>
  <div class="input-wrapper">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="input-label"
    >
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    
    <!-- Input container -->
    <div class="input-container">
      <!-- Icon avant -->
      <component
        v-if="iconBefore"
        :is="iconBefore"
        class="input-icon input-icon-before"
      />
      
      <!-- Input field -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <!-- Icon après -->
      <component
        v-if="iconAfter"
        :is="iconAfter"
        class="input-icon input-icon-after"
      />
    </div>
    
    <!-- Message d'erreur -->
    <p
      v-if="error"
      class="input-error"
    >
      {{ error }}
    </p>
    
    <!-- Message d'aide -->
    <p
      v-else-if="helpText"
      class="input-help"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  error?: string
  helpText?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  iconBefore?: any
  iconAfter?: any
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  return [
    'input-field',
    {
      'input-field--error': props.error,
      'input-field--with-icon-before': props.iconBefore,
      'input-field--with-icon-after': props.iconAfter
    }
  ].filter(Boolean).join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>

<style scoped>
.input-wrapper {
  width: 100%;
}

.input-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-1);
}

.input-required {
  color: var(--color-danger);
  margin-left: var(--spacing-1);
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-gray-400);
  pointer-events: none;
}

.input-icon-before {
  left: var(--spacing-3);
}

.input-icon-after {
  right: var(--spacing-3);
}

.input-field {
  display: block;
  width: 100%;
  border: var(--border-width) solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
  transition-property: border-color, box-shadow;
  background-color: var(--color-white);
  color: var(--color-gray-900);
  padding: var(--spacing-3) var(--spacing-4);
  font-size: 1.3rem;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.input-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--color-gray-50);
}

.input-field::placeholder {
  color: var(--color-gray-400);
}

/* Icon spacing adjustments */
.input-field--with-icon-before.input-field--sm {
  padding-left: 2.5rem;
}

.input-field--with-icon-before.input-field--md {
  padding-left: 2.5rem;
}

.input-field--with-icon-before.input-field--lg {
  padding-left: 2.75rem;
}

.input-field--with-icon-after.input-field--sm {
  padding-right: 2.5rem;
}

.input-field--with-icon-after.input-field--md {
  padding-right: 2.5rem;
}

.input-field--with-icon-after.input-field--lg {
  padding-right: 2.75rem;
}

/* Error state */
.input-field--error {
  border-color: var(--color-danger);
  color: var(--color-gray-900);
}

.input-field--error::placeholder {
  color: var(--color-danger);
  opacity: 0.6;
}

.input-field--error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 1px var(--color-danger);
}

.input-error {
  margin-top: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}

.input-help {
  margin-top: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}
</style>