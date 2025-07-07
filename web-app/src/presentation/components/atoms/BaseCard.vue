<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- Header -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">
          {{ title }}
        </h3>
      </slot>
    </div>
    
    <!-- Content -->
    <div :class="contentClasses">
      <slot />
    </div>
    
    <!-- Footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hover: false,
  clickable: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardClasses = computed(() => {
  return [
    'card',
    `card--${props.variant}`,
    {
      'card--hover': props.hover,
      'card--clickable': props.clickable
    }
  ].filter(Boolean).join(' ')
})

const contentClasses = computed(() => {
  return [
    'card-content',
    `card-content--${props.padding}`
  ].join(' ')
})

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.card {
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: var(--transition-normal);
  transition-property: transform, box-shadow;
}

.card--default {
  box-shadow: var(--shadow-sm);
  border: var(--border-width) solid var(--color-gray-200);
}

.card--elevated {
  box-shadow: var(--shadow-lg);
}

.card--outlined {
  border: 2px solid var(--color-gray-200);
}

.card--flat {
  border: var(--border-width) solid var(--color-gray-100);
}

.card--hover:hover {
  box-shadow: var(--shadow-md);
}

.card--clickable {
  cursor: pointer;
}

.card--clickable:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-0.125rem);
}

.card-header {
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
  border-bottom: var(--border-width) solid var(--color-gray-200);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0;
}

.card-content--none {
  padding: 0;
}

.card-content--sm {
  padding: var(--spacing-3);
}

.card-content--md {
  padding: var(--spacing-6);
}

.card-content--lg {
  padding: var(--spacing-8);
}

.card-footer {
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
  border-top: var(--border-width) solid var(--color-gray-200);
  background-color: var(--color-gray-50);
}
</style>