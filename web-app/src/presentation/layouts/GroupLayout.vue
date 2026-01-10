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
    height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  .main {
    flex: 1;
    height: 100%;
  }

  .bottom-nav {
    /* height: 4rem; */
  }

</style>