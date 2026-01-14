<template>
  <div class="group-home">
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component v-if="Component" :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>

    <button
      class="fab"
      @click="goToAddSelection"
      aria-label="Ajouter une tâche ou une catégorie"
    >
      <span class="fab-icon">+</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter, RouterView } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goToAddSelection = () => {
  const id = route.params.id
  router.push({
    name: 'GroupAddSelection',
    params: { id }
  })
}
</script>

<style scoped>
.group-home {
  position: relative;
  width: 100%;
  height: 100%;
}

.fab {
  position: fixed;
  bottom: calc(var(--bottom-nav-bar-height) + var(--spacing-4));
  right: var(--spacing-6);
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
  z-index: 1000;
}

.fab:hover {
  background: var(--color-primary-dark);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.fab:active {
  transform: scale(0.98);
}

.fab:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.fab-icon {
  line-height: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .fab {
    bottom: calc(var(--bottom-nav-bar-height) + var(--spacing-3));
    right: var(--spacing-4);
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .fab {
    transition: none;
  }
}
</style>