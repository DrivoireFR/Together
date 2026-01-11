<template>
  <div class="icon-selector">
    <label v-if="label" class="icon-selector-label">{{ label }}</label>
    <div class="icon-selector-container">
      <div class="icon-list" ref="iconListRef">
        <button
          v-for="iconValue in availableIcons"
          :key="iconValue"
          :class="['icon-item', { 'icon-item--selected': modelValue === iconValue }]"
          @click="selectIcon(iconValue)"
          type="button"
          :aria-label="`Sélectionner l'icône ${iconValue}`"
        >
          <div class="icon-item-wrapper">
            <IconComponent :icon="iconValue" />
          </div>
          <p>{{ $props.previewLabel }}</p>
        </button>
        <button
          v-if="allowNone"
          :class="['icon-item', 'icon-item--none', { 'icon-item--selected': modelValue === undefined }]"
          @click="selectIcon(undefined)"
          type="button"
          aria-label="Aucune icône"
        >
          <div class="icon-item-wrapper icon-item-wrapper--none">
            <span class="icon-none-text">Aucune</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@/shared/types/enums'
import IconComponent from '@/presentation/components/atoms/Icon.vue'

interface Props {
  modelValue?: Icon
  availableIcons?: Icon[]
  color?: string
  label?: string
  previewLabel?: string
  allowNone?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  availableIcons: () => Object.values(Icon),
  allowNone: true
})

const emit = defineEmits<{
  'update:modelValue': [value: Icon | undefined]
}>()

const iconListRef = ref<HTMLElement | null>(null)

const selectIcon = (icon: Icon | undefined) => {
  emit('update:modelValue', icon)
}
</script>

<style scoped>
.icon-selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.icon-selector-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.icon-selector-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--spacing-2) 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300) transparent;
}

.icon-selector-container::-webkit-scrollbar {
  height: 6px;
}

.icon-selector-container::-webkit-scrollbar-track {
  background: transparent;
}

.icon-selector-container::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300);
  border-radius: 3px;
}

.icon-selector-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-gray-400);
}

.icon-list {
  display: flex;
  gap: var(--spacing-3);
  padding: 0 var(--spacing-2);
  min-width: min-content;
}

.icon-item {
  --item-color: v-bind('color');
  flex-shrink: 0;
  width: 7.5rem;
  height: 7.5rem;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  background: var(--color-white);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  outline: none;
  color: var(--item-color);
}

.icon-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.icon-item:active {
  transform: translateY(0);
}

.icon-item--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.icon-item-wrapper {
  --icon-color: var(--item-color);
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-item-wrapper--none {
  width: 100%;
  height: 100%;
}

.icon-item--none {
  border-style: dashed;
}

.icon-none-text {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
}

.icon-item--selected .icon-none-text {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  /* .icon-item {
    width: 3.5rem;
    height: 3.5rem;
  } */

  .icon-item-wrapper {
    width: 2rem;
    height: 2rem;
  }
}
</style>
