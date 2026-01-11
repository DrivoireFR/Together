<template>
  <GroupLayout>
    <LoaderWithSpinner v-if="isLoading" />
    
    <div class="content" v-else-if="groupStore.currentGroup">
      <h1 class="title">{{ groupStore.currentGroup.nom }}</h1>

      <hr>

      <div class="nav-view">
        <RouterView />
      </div>
    </div>
    
    <div class="error-state" v-else>
      <h3 class="error-title">Groupe non trouvé</h3>
      <p class="error-description">Ce groupe n'existe pas ou vous n'y avez pas accès</p>
    </div>

    <TaskAcknowledgmentModal
      :show="tasksStore.showTaskAcknowledgmentModal"
    />
  </GroupLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useTasksStore } from '@/domain/stores/tasksStore'
import GroupLayout from '@/presentation/layouts/GroupLayout.vue'
import TaskAcknowledgmentModal from '@/presentation/components/molecules/TaskAcknowledgmentModal.vue'
import LoaderWithSpinner from '@/presentation/components/atoms/LoaderWithSpinner.vue'

const route = useRoute()
const groupStore = useGroupStore()
const tasksStore = useTasksStore()

const groupId = computed(() => Number(route.params.id))
const isLoading = computed(() => groupStore.isLoading || tasksStore.isLoading)

// Initialisation
onMounted(() => {
  const id = groupId.value
  if (id && !isNaN(id)) {
      groupStore.fetchGroupById(id)
  }
})
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  height: calc(100vh - var(--bottom-nav-bar-height));
  background: white;
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-3) 0;
}

.nav-view {
  margin: auto 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  container-type: inline-size;
}

.error-state {
  text-align: center;
  padding: var(--spacing-12) 0;
}

.error-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-2) 0;
}

.error-description {
  color: var(--color-gray-500);
  margin: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>