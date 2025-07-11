<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <div class="text-center">
        <!-- En-tête -->
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Nouvelle tâche détectée
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            {{ currentTaskIndex + 1 }} / {{ totalTasks }}
          </p>
        </div>

        <!-- Informations sur la tâche -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-center mb-3">
            <div 
              v-if="task?.iconUrl" 
              class="w-12 h-12 rounded-lg overflow-hidden mr-3"
            >
              <img 
                :src="task.iconUrl" 
                :alt="task.label"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="text-center">
              <h4 class="font-medium text-gray-900">{{ task?.label }}</h4>
              <p class="text-sm text-gray-600">
                {{ task?.frequenceEstimee }} fois par {{ task?.uniteFrequence }}
              </p>
            </div>
          </div>
          
          <div v-if="task?.tag" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
               :style="{ backgroundColor: task.tag.color + '20', color: task.tag.color }">
            {{ task.tag.label }}
          </div>
        </div>

        <!-- Question -->
        <div class="mb-6">
          <p class="text-gray-700 mb-4">
            Cette tâche vous concerne-t-elle ?
          </p>
          <p class="text-sm text-gray-500">
            Vous pouvez toujours modifier votre choix plus tard dans les paramètres.
          </p>
        </div>

        <!-- Boutons d'action -->
        <div class="flex space-x-3">
          <button
            @click="handleDecision(false)"
            :disabled="isLoading"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Traitement...' : 'Non concerné' }}
          </button>
          
          <button
            @click="handleDecision(true)"
            :disabled="isLoading"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Traitement...' : 'Je suis concerné' }}
          </button>
        </div>

        <!-- Option pour passer -->
        <div class="mt-4">
          <button
            @click="skipTask"
            :disabled="isLoading"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors 
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Passer pour le moment
          </button>
        </div>

        <!-- Bouton fermer -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
</style>