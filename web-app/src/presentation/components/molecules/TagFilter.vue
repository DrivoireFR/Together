<template>
  <div class="tag-filter">
    <div class="tag-filter-header">
      <h3 class="tag-filter-title">Filtrer par tag</h3>
      <BaseButton 
        v-if="selectedTag" 
        variant="ghost" 
        size="sm" 
        @click="clearFilter"
      >
        Effacer le filtre
      </BaseButton>
    </div>
    
    <div class="tag-list" v-if="tags.length > 0">
      <TagChip
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
        :tasks-count="getTasksCountForTag(tag)"
        :is-selected="selectedTag?.id === tag.id"
        variant="outlined"
        @click="selectTag(tag)"
      />
      
      <!-- Option pour afficher toutes les tâches -->
      <TagChip
        :tag="allTasksTag"
        :tasks-count="totalTasksCount"
        :is-selected="!selectedTag"
        variant="outlined"
        @click="clearFilter"
      />
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
import type { Tag, Task } from '@/shared/types/api'
import TagChip from '@/presentation/components/atoms/TagChip.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

interface Props {
  tags: Tag[]
  tasks: Task[]
  selectedTag?: Tag | null
}

const props = defineProps<Props>()

defineEmits<{
  'tag-selected': [tag: Tag | null]
}>()

const allTasksTag = computed((): Tag => ({
  id: -1,
  label: 'Toutes les tâches',
  color: '#6b7280',
  group: {} as any,
  tasks: [],
  createdAt: '',
  updatedAt: ''
}))

const totalTasksCount = computed(() => props.tasks.length)

const getTasksCountForTag = (tag: Tag): number => {
  return props.tasks.filter(task => task.tag?.id === tag.id).length
}

const selectTag = (tag: Tag) => {
  emit('tag-selected', tag)
}

const clearFilter = () => {
  emit('tag-selected', null)
}

const emit = defineEmits<{
  'tag-selected': [tag: Tag | null]
}>()
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
  display: flex;
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
</style>