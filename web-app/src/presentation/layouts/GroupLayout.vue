<template>
  <div class="group-layout">
    <main class="main wrapper">
      <slot />
    </main>

    <footer class="bottom-nav">
      <BottomNav />
    </footer>
  </div>
</template>

<script setup lang="ts">
import BottomNav from './BottomNav.vue'

</script>

<style scoped>
  .group-layout {
    --status-bar-offset: env(safe-area-inset-top);
    margin-top: var(--status-bar-offset);
    height: 100vh;

    display: flex;
    flex-direction: column;
  }

  .main {
    flex: 1;
    height: 100%;
  }
</style>


<style>
/* body.iphone .group-layout {
  --status-bar-offset: env(safe-area-inset-top);
  margin-top: var(--status-bar-offset);
  height: calc(100vh - var(--status-bar-offset));
}   */
</style>
