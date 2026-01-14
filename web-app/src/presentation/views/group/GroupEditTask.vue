<template>
  <div class="edit-task-container" v-if="task">
    <EditTaskForm
      :task="task"
      :tags="tasksStore.tags"
      :onSuccess="handleSuccess"
      :onCancel="handleCancel"
    />
  </div>

  <div v-else class="edit-task-empty">
    <p>Impossible de trouver cette tâche.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/domain/stores/tasksStore'
import type { Task } from '@/domain/types'
import EditTaskForm from '@/presentation/components/molecules/EditTaskForm.vue'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()

const taskId = computed(() => Number(route.params.taskId))

const task = computed<Task | undefined>(() =>
  tasksStore.tasks.find(t => t.id === taskId.value)
)

const handleSuccess = () => {
  const id = route.params.id
  router.push({
    name: 'GroupHomeTasks',
    params: { id }
  })
}

const handleCancel = () => {
  const id = route.params.id
  router.push({
    name: 'GroupHomeTasks',
    params: { id }
  })
}
</script>

<style scoped>
.edit-task-container {
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: var(--spacing-6);
  overflow-y: auto;
}

.edit-task-empty {
  padding: var(--spacing-6);
  text-align: center;
  color: var(--color-gray-600);
}

@media (max-width: 640px) {
  .edit-task-container {
    padding: var(--spacing-4);
  }
}
</style>

