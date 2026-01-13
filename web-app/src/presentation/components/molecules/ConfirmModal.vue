<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div class="modal-content">
            <div v-if="modalConfig?.title" class="modal-header">
              <h2 class="modal-title">{{ modalConfig.title }}</h2>
            </div>
            
            <div class="modal-body">
              <p v-if="modalConfig?.description" class="modal-description">
                {{ modalConfig.description }}
              </p>
              
              <component
                v-if="modalConfig?.template"
                :is="modalConfig.template"
              />
            </div>
            
            <div class="modal-footer">
              <button
                v-if="modalConfig?.cancelLabel !== ''"
                class="modal-button modal-button--cancel"
                @click="closeModal"
              >
                {{ modalConfig?.cancelLabel || 'Annuler' }}
              </button>
              <button
                class="modal-button modal-button--confirm"
                @click="handleConfirm"
              >
                {{ modalConfig?.confirmLabel || 'Confirmer' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useConfirmModalState } from '@/shared/composables/useConfirmModal'

const { isOpen, modalConfig, closeModal, handleConfirm } = useConfirmModalState()

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})

// Watch isOpen to manage body scroll
watch(isOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal, 1050);
  padding: var(--spacing-4);
  overflow-y: auto;
}

.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 100%;
  height: 100%;
  background: var(--color-white, #ffffff);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-header {
  padding: var(--spacing-6, 1.5rem) var(--spacing-6, 1.5rem) 0;
  flex-shrink: 0;
}

.modal-title {
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-gray-900, #111827);
  margin: 0;
}

.modal-body {
  padding: var(--spacing-6, 1.5rem);
  flex: 1;
  overflow-y: auto;
}

.modal-description {
  font-size: var(--font-size-base, 1rem);
  color: var(--color-gray-600, #4b5563);
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  padding: 0 var(--spacing-6, 1.5rem) var(--spacing-6, 1.5rem);
  display: flex;
  gap: var(--spacing-3, 0.75rem);
  flex-shrink: 0;
}

.modal-button {
  flex: 1;
  padding: var(--spacing-2, 0.5rem) var(--spacing-4, 1rem);
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: var(--font-weight-medium, 500);
  border-radius: var(--border-radius-md, 0.375rem);
  border: var(--border-width, 1px) solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  outline: none;
}

.modal-button:focus {
  box-shadow: 0 0 0 2px var(--color-white, #ffffff), 0 0 0 4px var(--color-primary, #007bff);
}

.modal-button--cancel {
  background-color: transparent;
  color: var(--color-gray-700, #374151);
  border-color: var(--color-gray-300, #d1d5db);
}

.modal-button--cancel:hover {
  background-color: var(--color-gray-50, #f9fafb);
}

.modal-button--confirm {
  background-color: var(--color-primary, #007bff);
  color: var(--color-white, #ffffff);
}

.modal-button--confirm:hover {
  background-color: var(--color-primary-hover, #0056b3);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.95) translateY(-1rem);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 15px;
  }
  
  .modal-container {
    padding: 0;
  }
  
  .modal-content {
    border-radius: 0;
  }
  
  .modal-header {
    padding: var(--spacing-4, 1rem) var(--spacing-4, 1rem) 0;
  }
  
  .modal-body {
    padding: var(--spacing-4, 1rem);
  }
  
  .modal-footer {
    padding: 0 var(--spacing-4, 1rem) var(--spacing-4, 1rem);
    flex-direction: column;
  }
  
  .modal-button {
    width: 100%;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal-content,
  .modal-leave-active .modal-content {
    transition: none;
  }
}
</style>
