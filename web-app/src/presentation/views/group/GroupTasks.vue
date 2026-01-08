<template>
    <div class="group-tasks-container">
        <TaskList
        :tasks="tasksStore.filteredTasks"
        :selected-tag="tasksStore.selectedTagFilter"
        :show-actions="true"
        @task-delete="handleTaskDelete"
        @task-click="handleTaskClick"
        >
        <!-- @task-edit="handleTaskEdit" -->
        </TaskList>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useTasksStore } from '@/domain/stores/tasksStore'
  import type { Task } from '@/domain/types'
  import TaskList from '@/presentation/components/molecules/TaskList.vue'
  
  const tasksStore = useTasksStore()  
  
//   const handleTaskEdit = (task: Task) => {
//     openEditTaskModal(task)
//   }
  
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
    tasksStore.createActionForTask(task.id)
  }
  
  // Navigation vers les statistiques
//   const goToStats = () => {
//     router.push({ name: 'GroupStats', params: { id: groupId.value } })
//   }
  
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