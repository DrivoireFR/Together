<template>
  <div class="progress-card">
    <div class="progress-header">
      <div class="category-info">
        <component :is="iconComponent" class="category-icon" :size="20" />
        <span class="category-name">{{ category }}</span>
      </div>
      <div class="status-badge" :class="statusClass">
        {{ statusText }}
      </div>
    </div>
    
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: fillPercentage + '%' }"></div>
      </div>
    </div>
    
    <div class="progress-info">
      <span class="progress-points">{{ currentPoints }} / {{ totalPoints }} points</span>
      <span class="progress-actions">{{ actionsCount }} actions cette semaine</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChefHat, CheckSquare, Shirt, ShoppingCart } from 'lucide-vue-next'

const props = defineProps<{
  icon: string
  category: string
  currentPoints: number
  totalPoints: number
  actionsCount: number
  status: 'good' | 'achieved' | 'behind'
}>()

const iconComponent = computed(() => {
  const iconMap = {
    'ChefHat': ChefHat,
    'CheckSquare': CheckSquare,
    'Shirt': Shirt,
    'ShoppingCart': ShoppingCart
  }
  return iconMap[props.icon as keyof typeof iconMap] || ChefHat
})

const fillPercentage = computed(() => {
  return Math.min((props.currentPoints / props.totalPoints) * 100, 100)
})

const statusClass = computed(() => {
  switch (props.status) {
    case 'good': return 'status-good'
    case 'achieved': return 'status-achieved'
    case 'behind': return 'status-behind'
    default: return 'status-good'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'good': return 'En bonne voie'
    case 'achieved': return 'Objectif atteint'
    case 'behind': return 'À rattraper'
    default: return 'En bonne voie'
  }
})
</script>

<style scoped>
.progress-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  color: #6b7280;
}

.category-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1.1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.status-good {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.status-achieved {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.status-behind {
  background: #fed7aa;
  color: #ea580c;
}

.progress-bar-container {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1e293b;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-points {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95rem;
}

.progress-actions {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .progress-card {
    padding: 1.25rem;
  }
  
  .category-name {
    font-size: 1rem;
  }
  
  .progress-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .progress-points,
  .progress-actions {
    font-size: 0.875rem;
  }
}
</style> 