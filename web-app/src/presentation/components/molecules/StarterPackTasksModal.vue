<template>
  <BaseModal
    :isOpen="isOpen"
    title="Choisissez vos tâches"
    size="xl"
    @close="handleClose"
  >
    <div class="starter-pack-content">
      <p class="description">
        Sélectionnez les tâches que vous souhaitez ajouter à votre groupe.
        Elles seront automatiquement associées aux catégories correspondantes.
      </p>

      <div class="tasks-by-category">
        <div
          v-for="category in categoriesWithTasks"
          :key="category.tag.id"
          class="category-section"
        >
          <div class="category-header">
            <div class="category-info">
              <div 
                class="category-color" 
                :style="{ backgroundColor: category.tag.color }"
              ></div>
              <h3 class="category-title">{{ category.tag.label }}</h3>
            </div>
            <div class="category-actions">
              <button
                type="button"
                class="select-all-btn"
                @click="toggleAllTasksInCategory(category)"
              >
                {{ areAllTasksSelectedInCategory(category) ? 'Tout désélectionner' : 'Tout sélectionner' }}
              </button>
            </div>
          </div>

          <div class="tasks-grid">
            <div
              v-for="task in category.tasks"
              :key="task.id"
              class="task-item"
              :class="{ 'selected': selectedTasks.has(task.id) }"
              @click="toggleTask(task)"
            >
              <div class="task-checkbox">
                <input
                  type="checkbox"
                  :checked="selectedTasks.has(task.id)"
                  @change="toggleTask(task)"
                />
              </div>
              <div class="task-info">
                <div class="task-header">
                  <span class="task-label">{{ task.label }}</span>
                  <div class="task-points">{{ task.points }} pts</div>
                </div>
                <div class="task-frequency">
                  {{ task.frequenceEstimee }}x par {{ task.uniteFrequence }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <template #footer>
      <div class="modal-actions">
        <BaseButton
          variant="outline"
          @click="handleClose"
          :disabled="isLoading"
        >
          Annuler
        </BaseButton>
        
        <BaseButton
          @click="handleValidate"
          :loading="isLoading"
          :disabled="selectedTasks.size === 0"
        >
          Valider les tâches ({{ selectedTasks.size }})
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/presentation/components/atoms/BaseModal.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import { groupRepository } from '@/data/repositories/groupRepository'
import type { Tag, Task } from '@/domain/types'

// Type pour les tâches du StarterPack (plus simple que les Task complètes)
interface StarterPackTask {
  id: number
  label: string
  frequenceEstimee: number
  uniteFrequence: string
  points: number
  tag: Tag
}

interface Props {
  isOpen: boolean
  availableTasks: StarterPackTask[]
  groupId: number
}

interface Emits {
  close: []
  success: [selectedTasks: Task[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedTasks = ref<Set<number>>(new Set())
const isLoading = ref(false)
const error = ref<string>('')

const categoriesWithTasks = computed(() => {
  const categories = new Map<number, { tag: Tag; tasks: StarterPackTask[] }>()
  
  props.availableTasks.forEach(task => {
    const tagId = task.tag.id
    if (!categories.has(tagId)) {
      categories.set(tagId, {
        tag: task.tag,
        tasks: []
      })
    }
    categories.get(tagId)!.tasks.push(task)
  })
  
  return Array.from(categories.values())
})

const selectedTasksList = computed(() => 
  props.availableTasks.filter(task => selectedTasks.value.has(task.id))
)

const toggleTask = (task: StarterPackTask) => {
  if (selectedTasks.value.has(task.id)) {
    selectedTasks.value.delete(task.id)
  } else {
    selectedTasks.value.add(task.id)
  }
}

const areAllTasksSelectedInCategory = (category: { tag: Tag; tasks: StarterPackTask[] }) => {
  return category.tasks.every(task => selectedTasks.value.has(task.id))
}

const toggleAllTasksInCategory = (category: { tag: Tag; tasks: StarterPackTask[] }) => {
  const allSelected = areAllTasksSelectedInCategory(category)
  
  category.tasks.forEach(task => {
    if (allSelected) {
      selectedTasks.value.delete(task.id)
    } else {
      selectedTasks.value.add(task.id)
    }
  })
}

const handleValidate = async () => {
  if (selectedTasks.value.size === 0) return

  isLoading.value = true
  error.value = ''

  try {
    const tasksToCreate = selectedTasksList.value.map(task => ({
      label: task.label,
      frequenceEstimee: task.frequenceEstimee,
      uniteFrequence: task.uniteFrequence,
      points: task.points,
      tagLabel: task.tag.label
    }))

    const result = await groupRepository.createBulkTasks(props.groupId, {
      tasks: tasksToCreate
    })

    if (result.isSuccess) {
      emit('success', result.data.tasks)
      handleClose()
    } else {
      error.value = result.message || 'Erreur lors de la création des tâches'
    }
  } catch (err) {
    error.value = 'Erreur lors de la création des tâches'
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  selectedTasks.value.clear()
  error.value = ''
  emit('close')
}
</script>

<style scoped>
.starter-pack-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.description {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin: 0;
}

.tasks-by-category {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--spacing-2);
  border-bottom: 2px solid var(--color-gray-200);
}

.category-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.category-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-white);
  box-shadow: 0 0 0 1px var(--color-gray-300);
}

.category-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.select-all-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius);
  transition: all 0.15s ease;
}

.select-all-btn:hover {
  background: var(--color-primary-light);
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-3);
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all 0.15s ease;
  background: var(--color-white);
}

.task-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.task-item.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.task-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-top: 2px;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
}

.task-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  flex: 1;
}

.task-points {
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius);
  white-space: nowrap;
}

.task-frequency {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-3);
  background-color: var(--color-danger-light);
  border-radius: var(--border-radius);
  border: var(--border-width) solid var(--color-danger);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .tasks-grid {
    grid-template-columns: 1fr;
  }
  
  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>