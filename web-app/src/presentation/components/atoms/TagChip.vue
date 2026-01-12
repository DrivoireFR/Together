<template>
  <button
    class="tag-chip"
    @click="$emit('click')"
  >
    <span class="tag-label">{{ tag.label }}</span>
  </button>
</template>

<script setup lang="ts">
import type { Tag } from '@/domain/types'

interface Props {
  tag: Tag
}

const props = defineProps<Props>()

</script>

<style scoped>
.tag-chip {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
  padding: .2rem .5rem;
  border: 1px solid;
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  outline: none;
  transition: all 0.15s ease;
  cursor: pointer;
  
  /* Default variant styles */
  color: v-bind('tag.color');
  border-color: v-bind('tag.color');
  background-color: transparent;
}
</style>