<template>
  <GroupLayout>
    <LoaderWithSpinner v-if="isLoading" />
    
    <div class="content" v-else-if="groupStore.currentGroup">
      <div class="group-head">
        <div class="group-head-left">
          <UserGroupIcon class="logo-svg" />
          <h1 class="title">{{ groupStore.currentGroup.nom }}</h1>
        </div>

        <div class="group-head-avatar" @click="onAvatarClick">
          <Avatar v-if="authStore.user" :username="authStore.user?.pseudo" :avatar="authStore.user?.avatar"  />
        </div>
      </div>

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
    <ActionAcknowledgmentModal
      :show="tasksStore.showActionAcknowledgmentModal"
    />
  </GroupLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useTasksStore } from '@/domain/stores/tasksStore'
import GroupLayout from '@/presentation/layouts/GroupLayout.vue'
import TaskAcknowledgmentModal from '@/presentation/components/molecules/TaskAcknowledgmentModal.vue'
import ActionAcknowledgmentModal from '@/presentation/components/molecules/ActionAcknowledgmentModal.vue'
import LoaderWithSpinner from '@/presentation/components/atoms/LoaderWithSpinner.vue'
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import Avatar from '@/presentation/components/atoms/Avatar.vue'
import { useAuthStore } from '@/domain/stores/authStore'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const tasksStore = useTasksStore()
const authStore = useAuthStore()

const groupId = computed(() => Number(route.params.id))
const isLoading = computed(() => groupStore.isLoading || tasksStore.isLoading)

function onAvatarClick() {
  const profilRoute = {
    name: 'Profile',
    params: { id: groupId.value }
  }
  router.push(profilRoute)
}

// Initialisation
onMounted(async () => {
  const id = groupId.value
  if (id && !isNaN(id)) {
    await groupStore.fetchGroupById(id)
    // Vérifier les actions en attente de validation
    await tasksStore.fetchPendingActionAcknowledgment()
  }
})
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--bottom-nav-bar-height));
  background: white;
}

.group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .5rem 1rem;
  background: var(--color-primary);
}

.group-head-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-svg {
  width: 2rem;
  stroke: white;
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: white;
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