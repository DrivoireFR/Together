<template>
    <div class="group-home">
        <TagFilter v-if="tasksStore.hasTags || tasksStore.hasTasks"/>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useTasksStore } from '@/domain/stores/tasksStore'
  import TagFilter from '@/presentation/components/molecules/TagFilter.vue'
  const tasksStore = useTasksStore()

</script>
  
<style scoped>  

</style>