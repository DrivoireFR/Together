<template>
  <AppLayout>
    <div class="stats-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement des statistiques...</p>
      </div>
      
      <div v-else-if="groupStore.currentGroup && tasksStore.hasStatistics" class="stats-content">
        <!-- Header -->
        <div class="stats-header">
          <div class="header-content">
            <h1 class="stats-title">Statistiques de {{ groupStore.currentGroup.nom }}</h1>
            <p class="stats-description">Analyse des actions et performances du groupe</p>
          </div>
          <BaseButton
            variant="ghost"
            @click="goBackToGroup"
          >
            ← Retour au groupe
          </BaseButton>
        </div>

        <!-- Statistiques générales -->
        <div class="general-stats">
          <StatCard
            icon="📊"
            :value="tasksStore.statistics!.totalActions"
            label="Actions totales"
            description="Nombre total d'actions réalisées"
          />
          <StatCard
            icon="⭐"
            :value="tasksStore.statistics!.totalWeight"
            label="Points cumulés"
            description="Score total basé sur l'importance et la fréquence"
          />
          <StatCard
            icon="👥"
            :value="Object.keys(tasksStore.statistics!.actionsByUser).length"
            label="Membres actifs"
            description="Nombre de membres ayant réalisé des actions"
          />
          <StatCard
            icon="🏷️"
            :value="Object.keys(tasksStore.statistics!.actionsByTag).length"
            label="Tags utilisés"
            description="Nombre de catégories d'actions"
          />
        </div>

        <!-- Statistiques détaillées -->
        <div class="detailed-stats">
          <UserStatsCard
            :user-stats="tasksStore.statistics!.actionsByUser"
            :actions="tasksStore.statistics!.actions"
          />
          <TagStatsCard
            :tag-stats="tasksStore.statistics!.actionsByTag"
            :actions="tasksStore.statistics!.actions"
          />
        </div>
      </div>
      
      <div v-else-if="!isLoading" class="error-state">
        <h3 class="error-title">Impossible de charger les statistiques</h3>
        <p class="error-description">Une erreur s'est produite lors du chargement des données</p>
        <BaseButton
          variant="primary"
          @click="loadStatistics"
        >
          Réessayer
        </BaseButton>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useTasksStore } from '@/domain/stores/tasksStore'
import AppLayout from '@/presentation/layouts/AppLayout.vue'
import StatCard from '@/presentation/components/atoms/StatCard.vue'
import UserStatsCard from '@/presentation/components/molecules/UserStatsCard.vue'
import TagStatsCard from '@/presentation/components/molecules/TagStatsCard.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const tasksStore = useTasksStore()

const groupId = computed(() => Number(route.params.id))
const isLoading = computed(() => groupStore.isLoading || tasksStore.isLoading)

const goBackToGroup = () => {
  router.push({ name: 'GroupDetail', params: { id: groupId.value } })
}

const loadStatistics = async () => {
  const id = groupId.value
  if (id && !isNaN(id)) {
    await Promise.all([
      groupStore.fetchGroupById(id),
      tasksStore.fetchStatisticsByGroupId(id)
    ])
  }
}

// Initialisation
onMounted(async () => {
  await loadStatistics()
})

// Nettoyage
onUnmounted(() => {
  // On garde les données pour permettre la navigation
})
</script>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  min-height: 100vh;
}

.loading-state {
  text-align: center;
  padding: var(--spacing-8) 0;
}

.loading-spinner {
  width: var(--spacing-8);
  height: var(--spacing-8);
  border: 2px solid var(--color-primary);
  border-top-color: transparent;
  border-radius: var(--border-radius-full);
  margin: 0 auto var(--spacing-2);
  animation: spin 1s linear infinite;
}

.loading-text {
  margin: 0;
  color: var(--color-gray-500);
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6);
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
}

.header-content {
  flex: 1;
}

.stats-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-1) 0;
}

.stats-description {
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.5;
}

.general-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
}

.detailed-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-6);
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
  margin: 0 0 var(--spacing-4) 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .stats-container {
    gap: var(--spacing-4);
  }
  
  .stats-header {
    flex-direction: column;
    gap: var(--spacing-4);
    text-align: center;
  }
  
  .general-stats {
    grid-template-columns: 1fr;
  }
  
  .detailed-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
}

@media (max-width: 640px) {
  .stats-header {
    padding: var(--spacing-4);
  }
  
  .stats-title {
    font-size: var(--font-size-xl);
  }
}
</style> 