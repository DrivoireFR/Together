<template>
  <div class="app-layout">
    <Header/>
    
    <!-- Main content -->
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import Header from './Header.vue'

</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.app-main {
  flex: 1;
  max-width: 80rem;
  margin: 0 auto;
  padding: var(--spacing-8) var(--spacing-4);
}
</style>