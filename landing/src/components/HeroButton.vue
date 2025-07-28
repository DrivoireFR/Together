<template>
  <button 
    :class="['hero-button', `hero-button--${variant}`]"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant: 'primary' | 'secondary'
  text: string
}>()

const handleClick = () => {
  // Handle button click
  console.log('Button clicked')
}
</script>

<style scoped>
.hero-button {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 200px;
}

.hero-button--primary {
  background-color: #000;
  color: white;
  border-color: #000;
}

.hero-button--primary:hover {
  background-color: #333;
  border-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.hero-button--secondary {
  background-color: transparent;
  color: #333;
  border-color: #ddd;
}

.hero-button--secondary:hover {
  background-color: #f8f8f8;
  border-color: #bbb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .hero-button {
    min-width: 250px;
  }
}
</style> 