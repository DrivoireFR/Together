<template>
    <div class="group-tasks-container">
      <div class="task-list-header">
        <h3 class="task-list-title">
          Vos {{ tasksStore.filteredTasks.length }} tâches pour :
          <TagChip
            v-if="tasksStore.selectedTagFilter"
            :tag="tasksStore.selectedTagFilter"
          />
        </h3>
      </div>
      
      <div class="task-swipe-list" v-if="tasksStore.filteredTasks.length > 0">
        <TaskSwipeCard
          v-for="task in tasksStore.filteredTasks"
          :key="task.id"
          :task="task"
          :group-members="groupMembers"
          @delete="handleTaskDelete"
          @declare="handleTaskDeclare"
        />
      </div>
      
      <div class="empty-state" v-else>
        <p class="empty-message">Aucune tâche disponible</p>
        <p class="empty-description">Créez votre première tâche pour commencer à organiser votre travail</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useTasksStore } from '@/domain/stores/tasksStore'
  import { useGroupStore } from '@/domain/stores/groupStore'
  import type { Task } from '@/domain/types'
  import TaskSwipeCard from '@/presentation/components/molecules/TaskSwipeCard.vue'
  import TagChip from '@/presentation/components/atoms/TagChip.vue'
  
  const route = useRoute()
  const tasksStore = useTasksStore()
  const groupStore = useGroupStore()
  
  const groupId = computed(() => Number(route.params.id))
  const groupMembers = computed(() => groupStore.currentGroupMembers)  
  
//   const handleTaskEdit = (task: Task) => {
//     openEditTaskModal(task)
//   }
  
  const handleTaskDelete = async (task: Task) => {
    const result = await tasksStore.deleteTask(task.id)
    
    if (!result.success) {
      console.error('Erreur lors de la suppression:', result.error)
      // Optionnel: notification d'erreur
    }
  }
  
  const handleTaskDeclare = async (task: Task) => {
    // Cette fonction est appelée par TaskSwipeCard lors du clic sur "Déclaration"
    // L'action est déjà gérée dans TaskSwipeCard
  }
  
  // Navigation vers les statistiques
//   const goToStats = () => {
//     router.push({ name: 'GroupStats', params: { id: groupId.value } })
//   }
  
  </script>
  
  <style scoped>
  .group-tasks-container {
    height: 100%;
    overflow-y: scroll;
    padding: var(--spacing-4) var(--spacing-4) 4rem var(--spacing-4);
  }

  .task-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-4);
  }

  .task-list-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-gray-900);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  .tasks-count {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    color: var(--color-gray-500);
  }

  .task-swipe-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-8) var(--spacing-4);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-4);
    opacity: 0.5;
  }

  .empty-message {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-700);
    margin: 0 0 var(--spacing-2) 0;
  }

  .empty-description {
    font-size: var(--font-size-base);
    color: var(--color-gray-500);
    margin: 0;
    line-height: 1.5;
    max-width: 32rem;
    margin-left: auto;
    margin-right: auto;
  }

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