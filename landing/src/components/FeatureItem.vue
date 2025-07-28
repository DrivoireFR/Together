<template>
  <div class="feature-item">
    <div class="feature-icon">
      <component :is="iconComponent" class="icon-svg" />
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Users, Key, Folder, CheckSquare, MousePointer, BookOpen, BarChart3, Gamepad2 } from 'lucide-vue-next'

const props = defineProps<{
  icon: string
  title: string
  description: string
}>()

const iconComponent = computed(() => {
  const iconMap = {
    'Users': Users,
    'Key': Key,
    'Folder': Folder,
    'CheckSquare': CheckSquare,
    'MousePointer': MousePointer,
    'BookOpen': BookOpen,
    'BarChart3': BarChart3,
    'Gamepad2': Gamepad2
  }
  return iconMap[props.icon as keyof typeof iconMap] || Users
})
</script>

<style scoped>
.feature-item {
  background: white;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #e5e7eb;
}

.feature-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  color: #6366f1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.icon-svg {
  width: 3rem;
  height: 3rem;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.feature-description {
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-size: 0.95rem;
  flex: 1;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .feature-item {
    padding: 1.5rem 1rem;
  }
  
  .feature-icon {
    margin-bottom: 1rem;
  }
  
  .icon-svg {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .feature-title {
    font-size: 1.2rem;
  }
  
  .feature-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .feature-item {
    padding: 1.25rem 1rem;
  }
  
  .feature-icon {
    /* Size handled by icon-svg class */
  }
  
  .icon-svg {
    width: 2rem;
    height: 2rem;
  }
  
  .feature-title {
    font-size: 1.1rem;
  }
}
</style> 