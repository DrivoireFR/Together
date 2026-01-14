<template>
  <div class="add-tag-container">
    <CreateTagForm
      :onSuccess="handleSuccess"
      :onCancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useConfirmModal } from '@/shared/composables/useConfirmModal'
import CreateTagForm from '@/presentation/components/molecules/CreateTagForm.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()

const groupId = computed(() => {
  if (groupStore.currentGroup) {
    return groupStore.currentGroup.id
  }
  return Number(route.params.id)
})

const handleSuccess = () => {
  useConfirmModal()
    .title('Tag créé avec succès !')
    .description('Votre nouveau tag a été créé et est maintenant disponible pour organiser vos tâches.')
    .confirmLabel('Retour aux tâches')
    .onConfirm(() => {
      router.push({ 
        name: 'GroupCats', 
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
.add-tag-container {
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: var(--spacing-6);
  overflow-y: auto;
}

@media (max-width: 640px) {
  .add-tag-container {
    padding: var(--spacing-4);
  }
}
</style>
