<template>
  <div class="history-panel">
    <!-- Bouton toggle -->
    <button
      class="history-toggle"
      :class="{ 'history-toggle--active': isOpen }"
      @click="togglePanel"
      :aria-label="isOpen ? 'Fermer l\'historique' : 'Ouvrir l\'historique'"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
        :class="{ 'icon--rotated': isOpen }"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
        <path d="M12 7v5l4 2"/>
      </svg>
    </button>

    <!-- Overlay -->
    <div 
      v-if="isOpen" 
      class="history-overlay"
      @click="closePanel"
    ></div>

    <!-- Panel -->
    <div 
      class="history-content"
      :class="{ 'history-content--open': isOpen }"
    >
      <div class="history-header">
        <h2 class="history-title">Historique des actions</h2>
        <button 
          class="history-close"
          @click="closePanel"
          aria-label="Fermer l'historique"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <ActionsList :actions="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Action } from '@/domain/types'
import ActionsList from '@/presentation/components/molecules/ActionsList.vue'

interface Props {
  actions: Action[]
}

defineProps<Props>()

const isOpen = ref(false)

const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const closePanel = () => {
  isOpen.value = false
}
</script>

<style scoped>
.history-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;
}

.history-toggle {
  position: absolute;
  top: 50%;
  right: var(--spacing-4);
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  background: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-full);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  pointer-events: auto;
}

.history-toggle:hover {
  background: var(--color-primary-dark, #2563eb);
  transform: translateY(-50%) scale(1.05);
}

.history-toggle--active {
  right: 22rem;
  background: var(--color-gray-600);
}

.icon--rotated {
  transform: rotate(180deg);
}

.history-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.history-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20rem;
  background: var(--color-gray-50);
  border-left: 1px solid var(--color-gray-200);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
}

.history-content--open {
  transform: translateX(0);
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
}

.history-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.history-close {
  background: none;
  border: none;
  color: var(--color-gray-500);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--border-radius-md);
  transition: all 0.15s ease;
}

.history-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

/* Responsive */
@media (max-width: 768px) {
  .history-content {
    width: 100vw;
    max-width: 24rem;
  }
  
  .history-toggle--active {
    right: 1rem;
  }
}
</style> 