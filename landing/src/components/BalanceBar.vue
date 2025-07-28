<template>
  <div class="balance-bar">
    <div class="balance-header">
      <div class="category-info">
        <span class="category-icon">{{ icon }}</span>
        <span class="category-name">{{ category }}</span>
      </div>
      <div class="balance-status" :class="statusClass">
        {{ statusText }}
      </div>
    </div>
    
    <div class="balance-content">
      <div class="partner-info">
        <span class="partner-name alex">{{ alexName }}</span>
        <span class="action-count">{{ alexActions }} action{{ alexActions > 1 ? 's' : '' }}</span>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill alex-fill" :style="{ width: alexPercentage + '%' }"></div>
      </div>
      
      <div class="partner-info right">
        <span class="partner-name marie">{{ marieName }}</span>
        <span class="action-count">{{ marieActions }} action{{ marieActions > 1 ? 's' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  category: string
  icon: string
  alexName: string
  marieName: string
  alexActions: number
  marieActions: number
}>()

const total = computed(() => props.alexActions + props.marieActions)
const alexPercentage = computed(() => total.value > 0 ? (props.alexActions / total.value) * 100 : 50)
const difference = computed(() => Math.abs(props.alexActions - props.marieActions))

const statusClass = computed(() => {
  if (difference.value <= 1) return 'equilibre'
  return 'ajuster'
})

const statusText = computed(() => {
  if (difference.value <= 1) return 'Équilibré'
  return 'À ajuster'
})
</script>

<style scoped>
.balance-bar {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  margin-bottom: 1rem;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-icon {
  font-size: 1.2rem;
}

.category-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1rem;
}

.balance-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.balance-status.equilibre {
  background: #dcfce7;
  color: #16a34a;
}

.balance-status.ajuster {
  background: #fef3c7;
  color: #d97706;
}

.balance-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
}

.partner-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 80px;
}

.partner-info.right {
  text-align: right;
}

.partner-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.partner-name.alex {
  color: #3b82f6;
}

.partner-name.marie {
  color: #ec4899;
}

.action-count {
  font-size: 0.8rem;
  color: #666;
}

.progress-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.alex-fill {
  background: #3b82f6;
}

@media (max-width: 768px) {
  .balance-bar {
    padding: 1rem;
  }
  
  .balance-content {
    gap: 0.75rem;
  }
  
  .partner-info {
    min-width: 60px;
  }
  
  .category-name {
    font-size: 0.9rem;
  }
}
</style> 