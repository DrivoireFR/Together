<template>
  <AppLayout>
    <div class="space-y-6">
      <div v-if="groupStore.isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-500">Chargement du groupe...</p>
      </div>
      
      <div v-else-if="groupStore.currentGroup">
        <h1 class="text-2xl font-bold text-gray-900">{{ groupStore.currentGroup.nom }}</h1>
        <p class="text-gray-600">Détails du groupe - À implémenter</p>
      </div>
      
      <div v-else class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900">Groupe non trouvé</h3>
        <p class="mt-2 text-gray-500">Ce groupe n'existe pas ou vous n'y avez pas accès</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import AppLayout from '@/presentation/layouts/AppLayout.vue'

const route = useRoute()
const groupStore = useGroupStore()

onMounted(async () => {
  const groupId = Number(route.params.id)
  if (groupId) {
    await groupStore.fetchGroupById(groupId)
  }
})
</script>