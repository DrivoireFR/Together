<template>
    <TagFilter v-if="tasksStore.hasTags || tasksStore.hasTasks"/>
</template>
  
  <script setup lang="ts">
  import { useTasksStore } from '@/domain/stores/tasksStore'
  import TagFilter from '@/presentation/components/molecules/TagFilter.vue'
  const tasksStore = useTasksStore()

</script>
  
<style scoped>  

</style>