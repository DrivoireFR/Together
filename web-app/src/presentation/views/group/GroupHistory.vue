<template>
    <div class="group-history">
      <ActionsList :actions="tasksStore.actions" />
    </div>
  </template>
  
  <script setup lang="ts">
    import ActionsList from '@/presentation/components/molecules/ActionsList.vue';
  import { useTasksStore } from '@/domain/stores/tasksStore'
  
  const tasksStore = useTasksStore()

  </script>
  
  <style scoped>
  
  </style>