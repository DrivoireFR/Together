<template>
  <div class="stat-card">
    <div class="stat-icon" v-if="icon">
      <span>{{ icon }}</span>
    </div>
    <div class="stat-content">
      <h3 class="stat-value">{{ value }}</h3>
      <p class="stat-label">{{ label }}</p>
      <p v-if="description" class="stat-description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  value: string | number
  label: string
  description?: string
}

defineProps<Props>()
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  transition: all 0.15s ease;
}

.stat-card:hover {
  border-color: var(--color-gray-300);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-50, #eff6ff);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-xl);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-1) 0;
  line-height: 1.2;
}

.stat-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.3;
}

.stat-description {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin: var(--spacing-1) 0 0 0;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 640px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    width: 2.5rem;
    height: 2.5rem;
    font-size: var(--font-size-lg);
  }
  
  .stat-value {
    font-size: var(--font-size-xl);
  }
}
</style> 