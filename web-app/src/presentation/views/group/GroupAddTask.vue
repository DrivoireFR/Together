<template>
  <div class="add-task-container">
    <CreateTaskForm
      :tags="tasksStore.tags"
      :groupId="groupId"
      :onSuccess="handleSuccess"
      :onCancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useTasksStore } from '@/domain/stores/tasksStore'
import { useConfirmModal } from '@/shared/composables/useConfirmModal'
import CreateTaskForm from '@/presentation/components/molecules/CreateTaskForm.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const tasksStore = useTasksStore()

const groupId = computed(() => {
  if (groupStore.currentGroup) {
    return groupStore.currentGroup.id
  }
  return Number(route.params.id)
})

const handleSuccess = () => {
  useConfirmModal()
    .title('Tâche créée avec succès !')
    .description('Votre nouvelle tâche a été créée et ajoutée à votre groupe.')
    .confirmLabel('Retour aux tâches')
    .onConfirm(() => {
      router.push({ 
        name: 'GroupHomeCats', 
        params: { id: groupId.value } 
      })
    })
    .open()
}

const handleCancel = () => {
  router.push({ name: 'GroupAddSelection' })
}
</script>

<style scoped>
.add-task-container {
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: var(--spacing-6);
  overflow-y: auto;
}

@media (max-width: 640px) {
  .add-task-container {
    padding: var(--spacing-4);
  }
}
</style>
