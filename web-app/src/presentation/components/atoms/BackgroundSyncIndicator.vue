<template>
  <Transition name="fade">
    <div v-if="isVisible" class="background-sync-indicator">
      <div class="sync-content">
        <div class="sync-spinner"></div>
        <span class="sync-text">{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isLoading: boolean
  message?: string
  position?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Synchronisation en cours...',
  position: 'top'
})

const isVisible = computed(() => props.isLoading)
</script>

<style scoped>
.background-sync-indicator {
  position: fixed;
  top: var(--spacing-4);
  right: var(--spacing-4);
  z-index: 1000;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-3) var(--spacing-4);
  max-width: 280px;
}

.background-sync-indicator[data-position="bottom"] {
  top: auto;
  bottom: var(--spacing-4);
}

.sync-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.sync-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-primary);
  border-top-color: transparent;
  border-radius: var(--border-radius-full);
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

.sync-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  line-height: 1.4;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .background-sync-indicator {
    top: var(--spacing-2);
    right: var(--spacing-2);
    left: var(--spacing-2);
    right: var(--spacing-2);
    max-width: none;
  }
  
  .sync-text {
    font-size: var(--font-size-xs);
  }
}
</style>