<template>
  <div class="collective-progress">
    <!-- Global Progress -->
    <div class="global-progress-card">
      <div class="global-header">
        <div class="global-info">
          <TrendingUp class="progress-icon" :size="20" />
          <span class="global-title">Progression globale</span>
        </div>
        <div class="global-percentage">{{ globalPercentage }}%</div>
      </div>
      
      <div class="global-progress-bar">
        <div class="global-progress-fill" :style="{ width: globalPercentage + '%' }"></div>
      </div>
      
      <div class="global-info-bottom">
        <span class="global-points">{{ currentGlobalPoints }} points</span>
        <span class="global-target">Objectif : {{ targetGlobalPoints }} points</span>
      </div>
    </div>

    <!-- Category Progress Cards -->
    <div class="categories-progress">
      <ProgressCard
        icon="ChefHat"
        category="Cuisine"
        :current-points="85"
        :total-points="100"
        :actions-count="12"
        status="good"
      />
      
      <ProgressCard
        icon="CheckSquare"
        category="Ménage"
        :current-points="120"
        :total-points="100"
        :actions-count="18"
        status="achieved"
      />
      
      <ProgressCard
        icon="Shirt"
        category="Linge"
        :current-points="60"
        :total-points="100"
        :actions-count="8"
        status="behind"
      />
      
      <ProgressCard
        icon="ShoppingCart"
        category="Courses"
        :current-points="95"
        :total-points="100"
        :actions-count="14"
        status="good"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next'
import ProgressCard from './ProgressCard.vue'

// Calculate global progress based on category data
const currentGlobalPoints = 360
const targetGlobalPoints = 400
const globalPercentage = Math.round((currentGlobalPoints / targetGlobalPoints) * 100)
</script>

<style scoped>
.collective-progress {
  background: rgba(16, 185, 129, 0.03);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.global-progress-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.global-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.global-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-icon {
  color: #16a34a;
}

.global-title {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1.1rem;
}

.global-percentage {
  font-size: 1.25rem;
  font-weight: 700;
  color: #16a34a;
}

.global-progress-bar {
  height: 12px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.global-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1e293b 0%, #374151 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.global-info-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.global-points {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1rem;
}

.global-target {
  color: #666;
  font-size: 0.95rem;
}

.categories-progress {
  display: flex;
  flex-direction: column;
  gap: 0rem;
}

@media (max-width: 768px) {
  .collective-progress {
    padding: 1rem;
  }
  
  .global-progress-card {
    padding: 1.25rem;
  }
  
  .global-info-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .global-title {
    font-size: 1rem;
  }
  
  .global-percentage {
    font-size: 1.1rem;
  }
}
</style> 