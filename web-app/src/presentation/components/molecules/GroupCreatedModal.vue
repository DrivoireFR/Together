<template>
  <BaseModal
    :isOpen="isOpen"
    title="Groupe créé avec succès !"
    size="md"
    @close="handleSkip"
    :closeOnOverlayClick="false"
    :closeOnEscape="false"
  >
    <div class="success-content">
      <div class="success-icon">
        <CheckCircleIcon class="icon" />
      </div>
      
      <div class="success-message">
        <h3 class="group-name">{{ groupName }}</h3>
        <p class="description">
          Votre groupe a été créé avec succès ! Pour vous faciliter la tâche, 
          nous vous proposons d'ajouter des catégories et des tâches prédéfinies.
        </p>
        <div class="group-code">
          <span class="code-label">Code du groupe :</span>
          <span class="code-value">{{ groupCode }}</span>
        </div>
      </div>

      <div class="starter-pack-preview">
        <div class="preview-section">
          <h4>Catégories disponibles :</h4>
          <div class="tags-preview">
            <div
              v-for="tag in availableTags.slice(0, 4)"
              :key="tag.id"
              class="tag-preview"
            >
              <div 
                class="tag-color" 
                :style="{ backgroundColor: tag.color }"
              ></div>
              <span>{{ tag.label }}</span>
            </div>
            <div v-if="availableTags.length > 4" class="more-tags">
              +{{ availableTags.length - 4 }} autres
            </div>
          </div>
        </div>

        <div class="preview-section">
          <h4>{{ availableTasks.length }} tâches prédéfinies disponibles</h4>
          <div class="tasks-preview">
            <span
              v-for="task in availableTasks.slice(0, 3)"
              :key="task.id"
              class="task-preview"
            >
              {{ task.label }}
            </span>
            <span v-if="availableTasks.length > 3" class="more-tasks">
              et {{ availableTasks.length - 3 }} autres...
            </span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-actions">
        <BaseButton
          variant="outline"
          @click="handleSkip"
        >
          Ignorer
        </BaseButton>
        
        <BaseButton
          @click="handleStartSetup"
        >
          Configurer mon groupe
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import BaseModal from '@/presentation/components/atoms/BaseModal.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import type { Tag, Task } from '@/domain/types'

interface Props {
  isOpen: boolean
  groupName: string
  groupCode: string
  availableTags: Tag[]
  availableTasks: Task[]
}

interface Emits {
  close: []
  startSetup: []
  skip: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleStartSetup = () => {
  emit('startSetup')
}

const handleSkip = () => {
  emit('skip')
  emit('close')
}
</script>

<style scoped>
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-6);
  text-align: center;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: var(--color-success-light);
  border-radius: 50%;
}

.success-icon .icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-success);
}

.success-message {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  width: 100%;
}

.group-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0;
}

.description {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin: 0;
}

.group-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--color-gray-100);
  border-radius: var(--border-radius);
}

.code-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.code-value {
  font-family: var(--font-mono);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  letter-spacing: 0.1em;
}

.starter-pack-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  width: 100%;
  padding: var(--spacing-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.preview-section h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  margin: 0;
  text-align: left;
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  justify-content: flex-start;
}

.tag-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--color-white);
  border-radius: var(--border-radius);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-200);
}

.tag-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-white);
  box-shadow: 0 0 0 1px var(--color-gray-300);
}

.more-tags {
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--color-gray-200);
  border-radius: var(--border-radius);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
}

.tasks-preview {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  justify-content: flex-start;
  text-align: left;
}

.task-preview {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}

.task-preview:not(:last-child)::after {
  content: " •";
  margin-left: var(--spacing-1);
  color: var(--color-gray-400);
}

.more-tasks {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
  width: 100%;
}

.modal-actions > * {
  flex: 1;
}

@media (max-width: 640px) {
  .modal-actions {
    flex-direction: column;
  }
  
  .tags-preview {
    justify-content: center;
  }
  
  .tasks-preview {
    justify-content: center;
    text-align: center;
  }
}
</style>