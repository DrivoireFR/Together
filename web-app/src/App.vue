<script setup lang="ts">
import ConfirmModal from '@/presentation/components/molecules/ConfirmModal.vue'
import { onMounted } from 'vue';

onMounted(() => {
  const platform = navigator.platform;
  document.body.classList.add(platform)
})
</script>

<template>
  <router-view />
  <ConfirmModal />
</template>


