<template>
  <div class="tag-stats-card">
    <div class="tag-stats-header">
      <h3 class="stats-title">Actions par tag</h3>
      <span class="stats-count">{{ Object.keys(tagStats).length }} tag{{ Object.keys(tagStats).length > 1 ? 's' : '' }}</span>
    </div>
    
    <div class="tag-stats-list" v-if="Object.keys(tagStats).length > 0">
      <div 
        v-for="(count, tagId) in sortedTagStats" 
        :key="tagId"
        class="tag-stat-item"
      >
        <div class="tag-info">
          <div 
            class="tag-color"
            :style="{ backgroundColor: getTagColor(tagId) }"
          ></div>
          <span class="tag-name">{{ getTagName(tagId) }}</span>
        </div>
        <div class="tag-actions">
          <span class="action-count">{{ count }}</span>
          <span class="action-label">action{{ count > 1 ? 's' : '' }}</span>
        </div>
      </div>
    </div>
    
    <div class="empty-state" v-else>
      <p class="empty-message">Aucune action avec tag</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Action } from '@/domain/types'

interface Props {
  tagStats: Record<number, number>
  actions: Action[]
}

const props = defineProps<Props>()

const sortedTagStats = computed(() => {
  return Object.fromEntries(
    Object.entries(props.tagStats)
      .sort(([,a], [,b]) => b - a)
  )
})

const getTagName = (tagId: string | number) => {
  const tag = props.actions.find(action => action.task.tag?.id === Number(tagId))?.task.tag
  return tag ? tag.label : `Tag ${tagId}`
}

const getTagColor = (tagId: string | number) => {
  const tag = props.actions.find(action => action.task.tag?.id === Number(tagId))?.task.tag
  return tag ? tag.color : '#6b7280'
}
</script>

<style scoped>
.tag-stats-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.tag-stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
}

.stats-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.stats-count {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  background: var(--color-white);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
}

.tag-stats-list {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.tag-stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-md);
  transition: all 0.15s ease;
}

.tag-stat-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-50, #eff6ff);
}

.tag-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.tag-color {
  width: 1rem;
  height: 1rem;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--color-gray-300);
}

.tag-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
}

.tag-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.action-count {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.action-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.empty-state {
  padding: var(--spacing-8);
  text-align: center;
}

.empty-message {
  color: var(--color-gray-500);
  margin: 0;
}
</style> 