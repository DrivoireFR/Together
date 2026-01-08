<template>
  <div class="tag-filter">
    <div class="tag-filter-header">
      <h3 class="tag-filter-title">Filtrer par tag</h3>
    </div>
    
    <div class="tag-list" v-if="tasksStore.tags.length > 0">
      <TagChip
        v-for="tag in tasksStore.tags"
        :key="tag.id"
        :tag="tag"
        :tasks-count="getTasksCountForTag(tag)"
        :is-selected="tasksStore.selectedTagFilter?.id === tag.id"
        variant="outlined"
        @click="tasksStore.setTagFilter(tag)"
      />
      
      <!-- Option pour afficher toutes les tâches -->
      <TagChip
        :tag="allTasksTag"
        :tasks-count="totalTasksCount"
        :is-selected="!tasksStore.selectedTagFilter"
        variant="outlined"
        @click="tasksStore.setTagFilter(null)"
      />

      <div class="urgency-container">
        <UrgencyFilter
          v-if="tasksStore.hasTasks"
          :sort-by-urgency="tasksStore.sortByUrgency"
          @toggle-urgency-sort="tasksStore.toggleSortByUrgency()"
        />
      </div>
    </div>
    
    <div class="empty-state" v-else>
      <p class="empty-message">Aucun tag disponible</p>
      <p class="empty-description">
        Les tags permettent d'organiser vos tâches par catégorie
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '@/domain/types'
import TagChip from '@/presentation/components/atoms/TagChip.vue'
import UrgencyFilter from './UrgencyFilter.vue'
import { useTasksStore } from '@/domain/stores/tasksStore'

const tasksStore = useTasksStore()


const allTasksTag = computed((): Tag => ({
  id: -1,
  label: 'Toutes les tâches',
  color: '#6b7280',
  group: {} as any,
  tasks: [],
  createdAt: '',
  updatedAt: ''
}))

const totalTasksCount = computed(() => tasksStore.tasks.length)

const getTasksCountForTag = (tag: Tag): number => {
  return tasksStore.tasks.filter(task => task.tag?.id === tag.id).length
}
</script>

<style scoped>
.tag-filter {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
}

.tag-filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.tag-filter-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.tag-list {
  --cols: 5;
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: repeat(var(--cols), 1fr);
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-6) var(--spacing-4);
}

.empty-message {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin: 0 0 var(--spacing-1) 0;
}

.empty-description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0;
  line-height: 1.5;
}

.urgency-container {
  grid-column: span var(--cols);
}

@media screen and (max-width: 800px) {
  .tag-list {
    --cols: 3;
  }
}

</style>