<template>
  <AppLayout>
    <div class="group-detail-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement du groupe...</p>
      </div>
      
      <div v-else-if="groupStore.currentGroup" class="group-content">
        <!-- En-tête du groupe avec code de partage -->
        <BaseCard class="group-header-card">
          <div class="group-header-content">
            <div class="group-info">
              <h1 class="group-title">{{ groupStore.currentGroup.nom }}</h1>
              <div class="group-stats">
                <span class="stat-item">{{ groupStore.currentGroup.users.length }} membre{{ groupStore.currentGroup.users.length > 1 ? 's' : '' }}</span>
                <span class="stat-item">{{ groupStore.currentGroup.tasks.length }} tâche{{ groupStore.currentGroup.tasks.length > 1 ? 's' : '' }}</span>
              </div>
            </div>
            <div class="share-section">
              <div class="share-code-container">
                <label class="share-label">Code de partage :</label>
                <div class="share-code-wrapper">
                  <span class="share-code">{{ groupStore.currentGroup.code }}</span>
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    @click="copyCodeToClipboard"
                    :disabled="copyingCode"
                    class="copy-button"
                  >
                    <span v-if="!codeCopied">📋 Copier</span>
                    <span v-else>✅ Copié !</span>
                  </BaseButton>
                </div>
                <p class="share-description">Partagez ce code pour inviter des membres</p>
              </div>
            </div>
          </div>
        </BaseCard>

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

      <!-- Bouton statistiques -->
      <div v-if="groupStore.currentGroup" class="stats-button-container">
        <BaseButton
          variant="primary"
          @click="goToStats"
          class="stats-button"
        >
          📊 Voir les statistiques
        </BaseButton>
      </div>

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

      <!-- Modal de création de tag -->
      <BaseModal
        :is-open="isCreateTagModalOpen"
        title="Créer un nouveau tag"
        @close="closeCreateTagModal"
      >
        <CreateTagForm
          :group-id="groupId"
          :is-loading="tasksStore.isLoading"
          @submit="handleCreateTag"
          @cancel="closeCreateTagModal"
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

      <!-- Panneau d'historique -->
      <HistoryPanel
        v-if="groupStore.currentGroup"
        :actions="tasksStore.actions"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useTasksStore } from '@/domain/stores/tasksStore'
import type { Tag, Task, CreateTaskPayload, CreateTagPayload, UpdateTaskPayload } from '@/shared/types/api'
import AppLayout from '@/presentation/layouts/AppLayout.vue'
import TagFilter from '@/presentation/components/molecules/TagFilter.vue'
import TaskList from '@/presentation/components/molecules/TaskList.vue'
import FloatingActionPanel from '@/presentation/components/molecules/FloatingActionPanel.vue'
import BaseModal from '@/presentation/components/atoms/BaseModal.vue'
import BaseCard from '@/presentation/components/atoms/BaseCard.vue'
import CreateTaskForm from '@/presentation/components/molecules/CreateTaskForm.vue'
import CreateTagForm from '@/presentation/components/molecules/CreateTagForm.vue'
import EditTaskForm from '@/presentation/components/molecules/EditTaskForm.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import TaskAcknowledgmentModal from '@/presentation/components/molecules/TaskAcknowledgmentModal.vue'
import HistoryPanel from '@/presentation/components/organisms/HistoryPanel.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const tasksStore = useTasksStore()

const isCreateTaskModalOpen = ref(false)
const isCreateTagModalOpen = ref(false)
const isEditTaskModalOpen = ref(false)
const taskToEdit = ref<Task | null>(null)
const copyingCode = ref(false)
const codeCopied = ref(false)

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

// Gestion des tags
const handleCreateTag = async (payload: CreateTagPayload) => {
  const result = await tasksStore.createTag(payload)
  
  if (result.success) {
    closeCreateTagModal()
    // Optionnel: notification de succès
  } else {
    // Optionnel: notification d'erreur
    console.error('Erreur lors de la création du tag:', result.error)
  }
}

const handleEditTask = async (payload: UpdateTaskPayload) => {
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
    await tasksStore.fetchRecentActionsByGroupId(groupId.value)
    // TODO Optionnel: notification de succès
  } else {
    console.error('Erreur lors de la création de l\'action:', result.error)
    // Optionnel: notification d'erreur
  }
}

// Navigation vers les statistiques
const goToStats = () => {
  router.push({ name: 'GroupStats', params: { id: groupId.value } })
}

// Copier le code de partage
const copyCodeToClipboard = async () => {
  if (!groupStore.currentGroup?.code) return
  
  try {
    copyingCode.value = true
    await navigator.clipboard.writeText(groupStore.currentGroup.code)
    codeCopied.value = true
    
    // Remettre l'état initial après 2 secondes
    setTimeout(() => {
      codeCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    // Fallback pour les navigateurs qui ne supportent pas l'API clipboard
    try {
      const textArea = document.createElement('textarea')
      textArea.value = groupStore.currentGroup.code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      codeCopied.value = true
      setTimeout(() => {
        codeCopied.value = false
      }, 2000)
    } catch (fallbackError) {
      console.error('Erreur lors de la copie (fallback):', fallbackError)
    }
  } finally {
    copyingCode.value = false
  }
}

// Initialisation
onMounted(async () => {
  const id = groupId.value
  if (id && !isNaN(id)) {
    // Charger les données du groupe, tâches/tags et historique en parallèle
    await Promise.all([
      groupStore.fetchGroupById(id),
      tasksStore.fetchGroupData(id),
      tasksStore.fetchRecentActionsByGroupId(id)
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

.group-header-card {
  margin-bottom: var(--spacing-2);
}

.group-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-6);
}

.group-info {
  flex: 1;
}

.group-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-3) 0;
}

.group-stats {
  display: flex;
  gap: var(--spacing-3);
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

.share-section {
  flex-shrink: 0;
}

.share-code-container {
  text-align: right;
}

.share-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-2);
}

.share-code-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-1);
}

.share-code {
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  border: 2px solid var(--color-primary-light);
  letter-spacing: 2px;
}

.copy-button {
  white-space: nowrap;
  transition: all 0.2s ease;
}

.share-description {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin: 0;
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

.stats-button-container {
  position: fixed;
  bottom: var(--spacing-4);
  left: var(--spacing-4);
  z-index: 100;
}

.stats-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .group-detail-container {
    gap: var(--spacing-4);
    padding-bottom: 5rem;
  }
  
  .group-header-content {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .share-code-container {
    text-align: left;
  }
  
  .share-code-wrapper {
    justify-content: flex-start;
  }
  
  .share-code {
    font-size: var(--font-size-base);
    letter-spacing: 1px;
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
  
  .stats-button-container {
    bottom: var(--spacing-3);
    left: var(--spacing-3);
  }
}
</style>