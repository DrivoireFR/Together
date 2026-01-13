<template>
  <div class="selection-container">
    <button 
      class="selection-button selection-button--task"
      @click="goToTask"
    >
      <div class="button-content">
        <span class="button-icon">📝</span>
        <h2 class="button-title">Créer une tâche</h2>
        <p class="button-description">Ajoutez une nouvelle tâche à votre groupe</p>
      </div>
    </button>
    
    <button 
      class="selection-button selection-button--tag"
      @click="goToTag"
    >
      <div class="button-content">
        <span class="button-icon">🏷️</span>
        <h2 class="button-title">Créer un tag</h2>
        <p class="button-description">Organisez vos tâches avec des catégories</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToTask = () => {
  router.push({ name: 'GroupAddTask' })
}

const goToTag = () => {
  router.push({ name: 'GroupAddTag' })
}
</script>

<style scoped>
.selection-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100%;
}

.selection-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: var(--spacing-6);
  position: relative;
  overflow: hidden;
}

.selection-button--task {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
}

.selection-button--task:hover {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  transform: scale(1.02);
}

.selection-button--task:active {
  transform: scale(0.98);
}

.selection-button--tag {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
  color: white;
}

.selection-button--tag:hover {
  background: linear-gradient(135deg, var(--color-secondary-dark) 0%, var(--color-secondary) 100%);
  transform: scale(1.02);
}

.selection-button--tag:active {
  transform: scale(0.98);
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  text-align: center;
}

.button-icon {
  font-size: 3rem;
  line-height: 1;
}

.button-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.button-description {
  font-size: var(--font-size-base);
  margin: 0;
  opacity: 0.9;
}

@media (max-width: 640px) {
  .button-icon {
    font-size: 2.5rem;
  }
  
  .button-title {
    font-size: var(--font-size-lg);
  }
  
  .button-description {
    font-size: var(--font-size-sm);
  }
}
</style>
