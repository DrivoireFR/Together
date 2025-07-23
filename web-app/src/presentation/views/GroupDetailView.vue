<template>
  <AppLayout>
    <div class="group-detail-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement du groupe...</p>
      </div>
      
      <div v-else-if="groupStore.currentGroup" class="group-content">
        <!-- Header du groupe -->
        <div class="group-header">
          <h1 class="group-title">{{ groupStore.currentGroup.nom }}</h1>
          <div class="group-stats">
            <span class="stat-item">
              {{ tasksStore.tasksCount }} tâche{{ tasksStore.tasksCount > 1 ? 's' : '' }}
            </span>
            <span class="stat-item">
              {{ tasksStore.tagsCount }} tag{{ tasksStore.tagsCount > 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Filtres par tags -->
        <TagFilter
          v-if="tasksStore.hasTags || tasksStore.hasTasks"
          :tags="tasksStore.tags"
          :tasks="tasksStore.tasks"
          :selected-tag="tasksStore.selectedTagFilter"
          @tag-selected="handleTagFilterChange"
        />

        <!-- Liste des tâches -->
        <TaskList
          :tasks="tasksStore.filteredTasks"
          :selected-tag="tasksStore.selectedTagFilter"
          :show-actions="true"
          @tag-click="handleTagClick"
          @task-edit="handleTaskEdit"
          @task-delete="handleTaskDelete"
          @task-click="handleTaskClick"
        >
          <template #empty-actions>
            <BaseButton
              variant="primary"
              @click="openCreateTaskModal"
            >
              Créer ma première tâche
            </BaseButton>
          </template>
        </TaskList>
      </div>
      
      <div v-else class="error-state">
        <h3 class="error-title">Groupe non trouvé</h3>
        <p class="error-description">Ce groupe n'existe pas ou vous n'y avez pas accès</p>
      </div>

      <!-- Panneau d'actions flottant -->
      <FloatingActionPanel
        v-if="groupStore.currentGroup"
        @create-task="openCreateTaskModal"
        @create-tag="openCreateTagModal"
      />

      <!-- Modal de création de tâche -->
      <BaseModal
        :is-open="isCreateTaskModalOpen"
        title="Créer une nouvelle tâche"
        @close="closeCreateTaskModal"
      >
        <CreateTaskForm
          :tags="tasksStore.tags"
          :group-id="groupId"
          :is-loading="tasksStore.isLoading"
          @submit="handleCreateTask"
          @cancel="closeCreateTaskModal"
        />
      </BaseModal>

      <!-- Modal d'édition de tâche -->
      <BaseModal
        :is-open="isEditTaskModalOpen"
        title="Modifier la tâche"
        @close="closeEditTaskModal"
      >
        <EditTaskForm
          v-if="taskToEdit"
          :task="taskToEdit"
          :tags="tasksStore.tags"
          :is-loading="tasksStore.isLoading"
          @submit="handleEditTask"
          @cancel="closeEditTaskModal"
        />
      </BaseModal>

      <!-- Modal de reconnaissance des tâches -->
      <TaskAcknowledgmentModal
        :show="tasksStore.showTaskAcknowledgmentModal"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useTasksStore } from '@/domain/stores/tasksStore'
import type { Tag, Task, CreateTaskPayload } from '@/shared/types/api'
import AppLayout from '@/presentation/layouts/AppLayout.vue'
import TagFilter from '@/presentation/components/molecules/TagFilter.vue'
import TaskList from '@/presentation/components/molecules/TaskList.vue'
import FloatingActionPanel from '@/presentation/components/molecules/FloatingActionPanel.vue'
import BaseModal from '@/presentation/components/atoms/BaseModal.vue'
import CreateTaskForm from '@/presentation/components/molecules/CreateTaskForm.vue'
import EditTaskForm from '@/presentation/components/molecules/EditTaskForm.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import TaskAcknowledgmentModal from '@/presentation/components/molecules/TaskAcknowledgmentModal.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const tasksStore = useTasksStore()

const isCreateTaskModalOpen = ref(false)
const isCreateTagModalOpen = ref(false)
const isEditTaskModalOpen = ref(false)
const taskToEdit = ref<Task | null>(null)

const groupId = computed(() => Number(route.params.id))
const isLoading = computed(() => groupStore.isLoading || tasksStore.isLoading)

// Actions pour les modales
const openCreateTaskModal = () => {
  isCreateTaskModalOpen.value = true
}

const closeCreateTaskModal = () => {
  isCreateTaskModalOpen.value = false
}

const openCreateTagModal = () => {
  isCreateTagModalOpen.value = true
}

const closeCreateTagModal = () => {
  isCreateTagModalOpen.value = false
}

const openEditTaskModal = (task: Task) => {
  taskToEdit.value = task
  isEditTaskModalOpen.value = true
}

const closeEditTaskModal = () => {
  isEditTaskModalOpen.value = false
  taskToEdit.value = null
}

// Gestion des tags et filtres
const handleTagFilterChange = (tag: Tag | null) => {
  tasksStore.setTagFilter(tag)
}

const handleTagClick = (tag: Tag) => {
  tasksStore.setTagFilter(tag)
}

// Gestion des tâches
const handleCreateTask = async (payload: CreateTaskPayload) => {
  const result = await tasksStore.createTask(payload)
  
  if (result.success) {
    closeCreateTaskModal()
    // Optionnel: notification de succès
  } else {
    // Optionnel: notification d'erreur
    console.error('Erreur lors de la création de la tâche:', result.error)
  }
}

const handleEditTask = async (payload: Partial<CreateTaskPayload>) => {
  if (!taskToEdit.value) return
  
  const result = await tasksStore.updateTask(taskToEdit.value.id, payload)
  
  if (result.success) {
    closeEditTaskModal()
    // Optionnel: notification de succès
  } else {
    // Optionnel: notification d'erreur
    console.error('Erreur lors de la modification de la tâche:', result.error)
  }
}

const handleTaskEdit = (task: Task) => {
  openEditTaskModal(task)
}

const handleTaskDelete = async (task: Task) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.label}" ?`)) {
    const result = await tasksStore.deleteTask(task.id)
    
    if (!result.success) {
      console.error('Erreur lors de la suppression:', result.error)
      // Optionnel: notification d'erreur
    }
  }
}

const handleTaskClick = async (task: Task) => {
  const result = await tasksStore.createActionForTask(task.id)
  
  if (result.success) {
    console.log('Action créée avec succès:', result.action)
    // Optionnel: notification de succès
  } else {
    console.error('Erreur lors de la création de l\'action:', result.error)
    // Optionnel: notification d'erreur
  }
}

// Initialisation
onMounted(async () => {
  const id = groupId.value
  if (id && !isNaN(id)) {
    // Charger les données du groupe et les tâches/tags en parallèle
    await Promise.all([
      groupStore.fetchGroupById(id),
      tasksStore.fetchGroupData(id)
    ])
  }
})

// Nettoyage
onUnmounted(() => {
  tasksStore.clearData()
})
</script>

<style scoped>
.group-detail-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  min-height: 100vh;
  padding-bottom: 6rem; /* Espace pour le panneau flottant */
}

.loading-state {
  text-align: center;
  padding: var(--spacing-8) 0;
}

.loading-spinner {
  width: var(--spacing-8);
  height: var(--spacing-8);
  border: 2px solid var(--color-primary);
  border-top-color: transparent;
  border-radius: var(--border-radius-full);
  margin: 0 auto var(--spacing-2);
  animation: spin 1s linear infinite;
}

.loading-text {
  margin: 0;
  color: var(--color-gray-500);
}

.group-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.group-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
}

.group-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0;
}

.group-stats {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  background: var(--color-gray-100);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.error-state {
  text-align: center;
  padding: var(--spacing-12) 0;
}

.error-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-2) 0;
}

.error-description {
  color: var(--color-gray-500);
  margin: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .group-detail-container {
    gap: var(--spacing-4);
    padding-bottom: 5rem;
  }
  
  .group-header {
    padding: var(--spacing-4);
  }
  
  .group-title {
    font-size: var(--font-size-xl);
  }
  
  .group-stats {
    gap: var(--spacing-2);
  }
  
  .stat-item {
    font-size: var(--font-size-xs);
    padding: var(--spacing-1) var(--spacing-2);
  }
}
</style>