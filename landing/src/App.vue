<script setup lang="ts">
  import IntroSection from './components/IntroSection.vue'
  import HeroSection from './components/HeroSection.vue'
  import FunctionalitiesSection from './components/FunctionalitiesSection.vue'
  import ManifestoSection from './components/ManifestoSection.vue'
  import HowItWorksSection from './components/HowItWorksSection.vue'
  import ProgressSection from './components/ProgressSection.vue'
  import InstallSection from './components/InstallSection.vue'
  import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="app">
    <main>
      <HeroSection />
      <FunctionalitiesSection />
      <ManifestoSection />
      <HowItWorksSection />
      <ProgressSection />
      <InstallSection />
      <IntroSection />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

main {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 100px);
}
</style>
