<template>
  <div class="status-card">
    <div class="status-header">
      <div class="status-icon">{{ icon }}</div>
      <div class="status-info">
        <h3 class="status-title">{{ title }}</h3>
        <StatusBadge :status="status" :text="statusText" />
      </div>
    </div>
    <p class="status-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'

defineProps<{
  icon: string
  title: string
  status: 'validee' | 'en-cours' | 'objectif' | 'essentiel'
  statusText: string
  description: string
}>()
</script>

<style scoped>
.status-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.status-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.status-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-title {
    text-align: start;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.status-description {
  color: #666;
  line-height: 1.6;
  margin: 0;
  flex: 1;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .status-card {
    padding: 1.25rem;
  }
  
  .status-header {
    gap: 0.75rem;
  }
  
  .status-icon {
    font-size: 1.75rem;
  }
  
  .status-title {
    font-size: 1.1rem;
  }
  
  .status-description {
    font-size: 0.9rem;
  }
}
</style> 