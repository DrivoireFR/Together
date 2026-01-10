<template>
  <GroupLayout>
    <LoaderWithSpinner v-if="isLoading" />
    
    <div class="content" v-else-if="groupStore.currentGroup">
      <BaseCard>
            <h1 class="title">{{ groupStore.currentGroup.nom }}</h1>

            <hr>

            <div class="nav-view">
              <RouterView />
            </div>
      </BaseCard>
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
import BaseCard from '@/presentation/components/atoms/BaseCard.vue'
import TaskAcknowledgmentModal from '@/presentation/components/molecules/TaskAcknowledgmentModal.vue'
import LoaderWithSpinner from './LoaderWithSpinner.vue'

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
  height: 100%;
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-3) 0;
}

.nav-view {
  margin: auto 0;
  height: 60vh;
  width: 100%;
  overflow-y: scroll;
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

.stats-button-container {
  position: fixed;
  bottom: var(--spacing-4);
  left: var(--spacing-4);
  z-index: 100;
}

.stats-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .group-detail-container {
    gap: var(--spacing-4);
    padding-bottom: 5rem;
  }
  
  .group-header-content {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .share-code-container {
    text-align: left;
  }
  
  .share-code-wrapper {
    justify-content: flex-start;
  }
  
  .share-code {
    font-size: var(--font-size-base);
    letter-spacing: 1px;
  }
  
  .group-header {
    padding: var(--spacing-4);
  }
  
  .group-title {
    font-size: var(--font-size-xl);
  }
  
  .group-stats {
    gap: var(--spacing-2);
  }
  
  .stat-item {
    font-size: var(--font-size-xs);
    padding: var(--spacing-1) var(--spacing-2);
  }
  
  .stats-button-container {
    bottom: var(--spacing-3);
    left: var(--spacing-3);
  }
}
</style>