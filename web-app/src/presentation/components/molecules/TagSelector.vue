<template>
  <div class="tag-selector">
    <label v-if="label" class="tag-selector-label">{{ label }}</label>
    <div class="tag-selector-container">
      <div class="tag-list" ref="tagListRef">
        <button
          v-for="tag in tags"
          :key="tag.id"
          :class="['tag-item', { 'tag-item--selected': modelValue === tag.id }]"
          @click="selectTag(tag.id)"
          type="button"
          :aria-label="`Sélectionner la catégorie ${tag.label}`"
        >
          <div @click.stop.prevent>
            <TagButton
              :tag="tag"
              :is-selected="modelValue === tag.id"
              variant="outlined"
              size="md"
              :show-options="false"
            />
          </div>
        </button>
        <button
          v-if="allowNone"
          :class="['tag-item', 'tag-item--none', { 'tag-item--selected': modelValue === undefined }]"
          @click="selectTag(undefined)"
          type="button"
          aria-label="Aucune catégorie"
        >
          <div class="tag-none-wrapper">
            <span class="tag-none-text">Aucune catégorie</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Tag } from '@/domain/types'
import TagButton from '@/presentation/components/atoms/TagButton.vue'

interface Props {
  modelValue?: number
  tags: Tag[]
  label?: string
  allowNone?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowNone: true
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

const tagListRef = ref<HTMLElement | null>(null)

const selectTag = (tagId: number | undefined) => {
  emit('update:modelValue', tagId)
}
</script>

<style scoped>
.tag-selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.tag-selector-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.tag-selector-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--spacing-2) 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300) transparent;
}

.tag-selector-container::-webkit-scrollbar {
  height: 6px;
}

.tag-selector-container::-webkit-scrollbar-track {
  background: transparent;
}

.tag-selector-container::-webkit-scrollbar-thumb {
  background-color: var(--color-gray-300);
  border-radius: 3px;
}

.tag-selector-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-gray-400);
}

.tag-list {
  display: flex;
  gap: var(--spacing-3);
  padding: 0 var(--spacing-2);
  min-width: min-content;
}

.tag-item {
  flex-shrink: 0;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  background: var(--color-white);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: var(--spacing-2);
  outline: none;
}

.tag-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tag-item:active {
  transform: translateY(0);
}

.tag-item--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.tag-item--none {
  border-style: dashed;
  min-width: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-none-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-none-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
}

.tag-item--selected .tag-none-text {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .tag-item {
    padding: var(--spacing-1);
  }
}
</style>
