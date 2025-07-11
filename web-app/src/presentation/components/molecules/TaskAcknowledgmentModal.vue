<template>
  <div 
    v-if="show" 
    class="modal-overlay"
    @click.self="closeModal"
  >
    <div class="modal-content">
      <div class="modal-inner">
        <!-- En-tête -->
        <div class="modal-header">
          <h3 class="modal-title">
            Nouvelle tâche détectée
          </h3>
          <p class="modal-progress">
            {{ currentTaskIndex + 1 }} / {{ totalTasks }}
          </p>
        </div>

        <!-- Informations sur la tâche -->
        <div class="task-info">
          <div class="task-main-info">
            <div 
              v-if="task?.iconUrl" 
              class="task-icon"
            >
              <img 
                :src="task.iconUrl" 
                :alt="task.label"
                class="task-icon-image"
              />
            </div>
            <div class="task-details">
              <h4 class="task-title">{{ task?.label }}</h4>
              <p class="task-frequency">
                {{ task?.frequenceEstimee }} fois par {{ task?.uniteFrequence }}
              </p>
            </div>
          </div>
          
          <div v-if="task?.tag" class="task-tag"
               :style="{ backgroundColor: task.tag.color + '20', color: task.tag.color }">
            {{ task.tag.label }}
          </div>
        </div>

        <!-- Question -->
        <div class="modal-question">
          <p class="question-main">
            Cette tâche vous concerne-t-elle ?
          </p>
          <p class="question-sub">
            Vous pouvez toujours modifier votre choix plus tard dans les paramètres.
          </p>
        </div>

        <!-- Boutons d'action -->
        <div class="action-buttons">
          <button
            @click="handleDecision(false)"
            :disabled="isLoading"
            class="btn btn-secondary"
          >
            {{ isLoading ? 'Traitement...' : 'Non concerné' }}
          </button>
          
          <button
            @click="handleDecision(true)"
            :disabled="isLoading"
            class="btn btn-primary"
          >
            {{ isLoading ? 'Traitement...' : 'Je suis concerné' }}
          </button>
        </div>

        <!-- Option pour passer -->
        <div class="skip-option">
          <button
            @click="skipTask"
            :disabled="isLoading"
            class="skip-button"
          >
            Passer pour le moment
          </button>
        </div>

        <!-- Bouton fermer -->
        <button
          @click="closeModal"
          class="close-button"
        >
          <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTasksStore } from '@/domain/stores/tasksStore'

// Props
interface Props {
  show: boolean
}

defineProps<Props>()

// Store
const tasksStore = useTasksStore()

// Computed
const task = computed(() => tasksStore.currentUnacknowledgedTask)
const currentTaskIndex = computed(() => tasksStore.currentUnacknowledgedTaskIndex)
const totalTasks = computed(() => tasksStore.unacknowledgedTasks.length)
const isLoading = computed(() => tasksStore.isLoading)

// Methods
const handleDecision = async (isConcerned: boolean) => {
  await tasksStore.handleTaskDecision(isConcerned)
}

const skipTask = () => {
  tasksStore.skipTaskAcknowledgment()
}

const closeModal = () => {
  tasksStore.closeTaskAcknowledgmentModal()
}
</script>

<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
}

.modal-content {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
}

.modal-inner {
  text-align: center;
}

/* En-tête */
.modal-header {
  margin-bottom: var(--spacing-4);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-2) 0;
}

.modal-progress {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0 0 var(--spacing-4) 0;
}

/* Informations sur la tâche */
.task-info {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
}

.task-main-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-3);
}

.task-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  margin-right: var(--spacing-3);
  flex-shrink: 0;
}

.task-icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.task-details {
  text-align: center;
}

.task-title {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0;
}

.task-frequency {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0;
}

.task-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* Question */
.modal-question {
  margin-bottom: var(--spacing-6);
}

.question-main {
  color: var(--color-gray-700);
  margin: 0 0 var(--spacing-4) 0;
}

.question-sub {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0;
}

/* Boutons d'action */
.action-buttons {
  display: flex;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.btn {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-lg);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: var(--font-weight-medium);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-gray-200);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

/* Option pour passer */
.skip-option {
  margin-top: var(--spacing-4);
}

.skip-button {
  background: none;
  border: none;
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  cursor: pointer;
  transition: color 0.2s ease;
}

.skip-button:hover:not(:disabled) {
  color: var(--color-gray-700);
}

.skip-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Bouton fermer */
.close-button {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: var(--color-gray-600);
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Animations pour les transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active, .modal-content-leave-active {
  transition: transform 0.3s ease;
}

.modal-content-enter-from, .modal-content-leave-to {
  transform: scale(0.9) translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    max-width: none;
    margin: var(--spacing-4);
  }
  
  .task-main-info {
    flex-direction: column;
    text-align: center;
  }
  
  .task-icon {
    margin-right: 0;
    margin-bottom: var(--spacing-2);
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>