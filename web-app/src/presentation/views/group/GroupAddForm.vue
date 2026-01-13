<template>
  <div class="group-add-container">
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component v-if="Component" :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.group-add-container {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style> 