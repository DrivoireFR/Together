<script setup lang="ts">
// Application principale - la logique est gérée par les stores et vues individuelles
import ConfirmModal from '@/presentation/components/molecules/ConfirmModal.vue'
</script>

<template>
  <router-view />
  <ConfirmModal />
</template>


