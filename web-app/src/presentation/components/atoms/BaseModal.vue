<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" :class="modalClasses">
          <div class="modal-header" v-if="showHeader">
            <h2 v-if="title" class="modal-title">{{ title }}</h2>
            <button
              v-if="showCloseButton"
              class="modal-close"
              @click="close"
              :aria-label="closeButtonLabel"
            >
              <span class="modal-close-icon">×</span>
            </button>
          </div>
          
          <div class="modal-body">
            <slot />
          </div>
          
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showHeader?: boolean
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  closeButtonLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  showHeader: true,
  showCloseButton: true,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  closeButtonLabel: 'Fermer'
})

const modalClasses = computed(() => [
  'modal-content',
  `modal-content--${props.size}`
])

const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlayClick && event.target === event.currentTarget) {
    emit('close')
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (props.closeOnEscape && event.key === 'Escape') {
    emit('close')
  }
}

const close = () => {
  emit('close')
}

onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleEscapeKey)
  }
  
  // Empêcher le scroll du body quand la modal est ouverte
  if (props.isOpen) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})

const emit = defineEmits<{
  close: []
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: var(--spacing-4);
  overflow-y: auto;
}

.modal-container {
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-content {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.modal-content--sm {
  max-width: 28rem;
}

.modal-content--md {
  max-width: 32rem;
}

.modal-content--lg {
  max-width: 48rem;
}

.modal-content--xl {
  max-width: 64rem;
}

.modal-content--full {
  max-width: 95vw;
  max-height: 95vh;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6) var(--spacing-6) 0;
  flex-shrink: 0;
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--color-gray-400);
  cursor: pointer;
  transition: all 0.15s ease;
}

.modal-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.modal-close:focus {
  outline: none;
  background: var(--color-gray-100);
  color: var(--color-gray-600);
  box-shadow: 0 0 0 2px var(--color-primary);
}

.modal-close-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.modal-body {
  padding: var(--spacing-6);
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 0 var(--spacing-6) var(--spacing-6);
  flex-shrink: 0;
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
    padding: var(--spacing-2);
    align-items: flex-end;
  }
  
  .modal-content {
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    max-height: 85vh;
  }
  
  .modal-content--full {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }
  
  .modal-header {
    padding: var(--spacing-4) var(--spacing-4) 0;
  }
  
  .modal-body {
    padding: var(--spacing-4);
  }
  
  .modal-footer {
    padding: 0 var(--spacing-4) var(--spacing-4);
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