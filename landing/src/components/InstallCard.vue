<template>
  <div class="install-card">
    <div class="install-header">
      <div class="platform-icons">
        <span v-for="icon in icons" :key="icon" class="platform-icon">{{ icon }}</span>
      </div>
      <h3 class="platform-title" :class="titleColor">{{ title }}</h3>
    </div>
    
    <ol class="install-steps">
      <li v-for="(step, index) in steps" :key="index" class="install-step">
        {{ step }}
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icons: string[]
  title: string
  titleColor: string
  steps: string[]
}>()
</script>

<style scoped>
.install-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.install-header {
  margin-bottom: 1.5rem;
}

.platform-icons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.platform-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.platform-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.platform-title.android {
  color: #34a853;
}

.platform-title.ios {
  color: #007aff;
}

.install-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step-counter;
}

.install-step {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.5;
  counter-increment: step-counter;
}

.install-step::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.install-step:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .install-card {
    padding: 1.5rem;
  }
  
  .platform-title {
    font-size: 1.3rem;
  }
  
  .install-step {
    font-size: 0.95rem;
  }
}
</style> 