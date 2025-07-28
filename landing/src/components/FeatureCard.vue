<template>
  <div class="feature-card">
    <div class="feature-icon">
      <component :is="iconComponent" class="icon-svg" />
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PenTool, Eye, Heart } from 'lucide-vue-next'

const props = defineProps<{
  icon: string
  title: string
  description: string
}>()

const iconComponent = computed(() => {
  const iconMap = {
    'PenTool': PenTool,
    'Eye': Eye,
    'Heart': Heart
  }
  return iconMap[props.icon as keyof typeof iconMap] || PenTool
})
</script>

<style scoped>
.feature-card {
  background: white;
  border-radius: 20px;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  margin-bottom: 1.3rem;
  display: flex;
  justify-content: center;
  color: #6366f1;
}

.icon-svg {
  width: 3rem;
  height: 3rem;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: .6rem;
}

.feature-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .feature-card {
    padding: 2rem 1rem;
  }
  
  .icon-svg {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .feature-title {
    font-size: 1.3rem;
  }
  
  .feature-description {
    font-size: 0.95rem;
  }
}
</style> 