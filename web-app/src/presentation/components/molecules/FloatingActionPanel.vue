<template>
  <div class="floating-panel" :class="{ 'floating-panel--expanded': isExpanded }">
    <!-- Bouton principal -->
    <button 
      class="fab-main"
      :class="{ 'fab-main--expanded': isExpanded }"
      @click="togglePanel"
      :aria-label="isExpanded ? 'Fermer le menu' : 'Ouvrir le menu d\'actions'"
    >
      <span class="fab-icon" :class="{ 'fab-icon--rotated': isExpanded }">
        {{ isExpanded ? '×' : '+' }}
      </span>
    </button>

    <!-- Actions secondaires -->
    <Transition name="fab-actions">
      <div v-if="isExpanded" class="fab-actions">
        <div class="fab-action" v-for="(action, index) in actions" :key="action.id">
          <button
            class="fab-button"
            :style="{ transitionDelay: `${index * 50}ms` }"
            @click="handleActionClick(action)"
            :aria-label="action.label"
            :title="action.label"
          >
            <span class="fab-button-icon">{{ action.icon }}</span>
          </button>
          <span class="fab-button-label">{{ action.label }}</span>
        </div>
      </div>
    </Transition>

    <!-- Overlay pour fermer le panel -->
    <Transition name="overlay">
      <div 
        v-if="isExpanded" 
        class="fab-overlay" 
        @click="closePanel"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface FloatingAction {
  id: string
  label: string
  icon: string
  action: () => void
}

interface Props {
  actions?: FloatingAction[]
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => []
})

const isExpanded = ref(false)

const defaultActions = computed((): FloatingAction[] => [
  {
    id: 'create-task',
    label: 'Créer une tâche',
    icon: '📝',
    action: () => emit('create-task')
  },
  {
    id: 'create-tag',
    label: 'Créer un tag',
    icon: '🏷️',
    action: () => emit('create-tag')
  }
])

const actions = computed(() => 
  props.actions.length > 0 ? props.actions : defaultActions.value
)

const togglePanel = () => {
  isExpanded.value = !isExpanded.value
}

const closePanel = () => {
  isExpanded.value = false
}

const handleActionClick = (action: FloatingAction) => {
  action.action()
  emit('action-click', action)
  closePanel()
}

const emit = defineEmits<{
  'create-task': []
  'create-tag': []
  'action-click': [action: FloatingAction]
}>()
</script>

<style scoped>
.floating-panel {
  position: fixed;
  bottom: var(--spacing-6);
  right: var(--spacing-6);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-3);
}

.fab-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.fab-main {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--border-radius-full);
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.fab-main:hover {
  background: var(--color-primary-dark);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.fab-main--expanded {
  background: var(--color-gray-600);
}

.fab-main--expanded:hover {
  background: var(--color-gray-700);
}

.fab-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
}

.fab-icon--rotated {
  transform: rotate(45deg);
}

.fab-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  align-items: flex-end;
}

.fab-action {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  opacity: 0;
  transform: translateY(10px) scale(0.8);
  animation: fab-action-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.fab-button {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--border-radius-full);
  background: var(--color-white);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-200);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.fab-button:hover {
  background: var(--color-gray-50);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--color-gray-300);
}

.fab-button-icon {
  line-height: 1;
}

.fab-button-label {
  background: var(--color-gray-800);
  color: var(--color-white);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease;
  pointer-events: none;
}

.fab-action:hover .fab-button-label {
  opacity: 1;
  transform: translateX(0);
}

@keyframes fab-action-enter {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Transitions */
.fab-actions-enter-active,
.fab-actions-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-actions-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fab-actions-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .floating-panel {
    bottom: var(--spacing-4);
    right: var(--spacing-4);
  }
  
  .fab-main {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }
  
  .fab-button {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .fab-button-label {
    display: none;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .fab-main,
  .fab-button,
  .fab-icon,
  .fab-action,
  .fab-button-label {
    transition: none;
    animation: none;
  }
}
</style>