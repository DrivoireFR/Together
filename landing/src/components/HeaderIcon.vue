<template>
  <div class="header-icon">
    <span class="icon">{{ icon }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
}>()
</script>

<style scoped>
.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.header-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.icon {
  font-size: 1.2rem;
  user-select: none;
}
</style> 