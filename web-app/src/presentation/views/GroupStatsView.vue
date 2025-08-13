<template>
  <AppLayout>
    <div class="stats-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement des statistiques...</p>
      </div>
      
      <div v-else-if="groupStore.currentGroup && statsStore.hasOverview" class="stats-content">
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

        <!-- Progression globale -->
        <div v-if="statsStore.overview" class="global-progress">
          <div class="progress-card">
            <div class="progress-header-section">
              <h2 class="progress-title">Progression mensuelle</h2>
              <p class="progress-subtitle">Avancement des objectifs du mois</p>
            </div>
            
            <div class="progress-content">
              <ProgressBar
                :current="statsStore.overview.totalDone"
                :total="statsStore.overview.totalTasksVolume"
                label="Volume mensuel réalisé"
                variant="primary"
                size="lg"
                :show-details="true"
                :precision="1"
              />
            </div>
            
            <div class="progress-stats">
              <div class="progress-stat">
                <span class="stat-label">Objectif mensuel</span>
                <span class="stat-value">{{ statsStore.overview.totalTasksVolume }} pts</span>
              </div>
              <div class="progress-stat">
                <span class="stat-label">Réalisé</span>
                <span class="stat-value">{{ statsStore.overview.totalDone }} pts</span>
              </div>
              <div class="progress-stat">
                <span class="stat-label">Restant</span>
                <span class="stat-value">{{ statsStore.overview.totalTasksVolume - statsStore.overview.totalDone }} pts</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Objectifs individuels -->
        <div v-if="statsStore.overview && statsStore.personalGoals" class="individual-goals">
          <div class="goals-card">
            <div class="goals-header-section">
              <h2 class="goals-title">Objectifs individuels</h2>
              <p class="goals-subtitle">Progression de chaque membre du groupe</p>
            </div>
            
            <div class="goals-list">
              <div 
                v-for="goal in statsStore.personalGoals" 
                :key="goal.user.id" 
                class="user-goal"
              >
                <div class="user-info">
                  <div class="user-avatar">
                    <img 
                      v-if="goal.user.icone" 
                      :src="goal.user.icone" 
                      :alt="goal.user.prenom"
                      class="avatar-image"
                    />
                    <span class="avatar-fallback">
                      {{ goal.user.prenom.charAt(0) + goal.user.nom.charAt(0) }}
                    </span>
                  </div>
                  <div class="user-details">
                    <h3 class="user-name">{{ goal.user.prenom }} {{ goal.user.nom }}</h3>
                    <p class="user-pseudo">@{{ goal.user.pseudo }}</p>
                  </div>
                </div>
                
                <div class="user-progress">
                  <ProgressBar
                    :current="goal.doneThisMonth"
                    :total="statsStore.overview.totalTasksVolume / statsStore.personalGoals.length"
                    :label="`${goal.user.actions.length} actions ce mois`"
                    variant="success"
                    size="md"
                    :show-details="false"
                    :precision="0"
                  />
                </div>
              </div>
            </div> 
          </div>
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
import { useStatsStore } from '@/domain/stores/statsStore'
import AppLayout from '@/presentation/layouts/AppLayout.vue'
import ProgressBar from '@/presentation/components/atoms/ProgressBar.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const statsStore = useStatsStore()

const groupId = computed(() => Number(route.params.id))
const isLoading = computed(() => groupStore.isLoading || statsStore.isLoading)

const goBackToGroup = () => {
  router.push({ name: 'GroupDetail', params: { id: groupId.value } })
}

const loadStatistics = async () => {
  const id = groupId.value
  if (id && !isNaN(id)) {
    await statsStore.fetchOverview(id)
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

/* Progression globale */
.global-progress {
  margin: var(--spacing-4) 0;
}

.progress-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-header-section {
  margin-bottom: var(--spacing-4);
}

.progress-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-1) 0;
}

.progress-subtitle {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
}

.progress-content {
  margin: var(--spacing-4) 0;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-gray-200);
}

.progress-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-1);
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

/* Objectifs individuels */
.individual-goals {
  margin: var(--spacing-4) 0;
}

.goals-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.goals-header-section {
  margin-bottom: var(--spacing-4);
}

.goals-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-1) 0;
}

.goals-subtitle {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.user-goal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3);
  gap: var(--spacing-4);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.user-avatar {
  width: var(--spacing-8);
  height: var(--spacing-8);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-light);
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  background-color: var(--color-primary);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-1) 0;
}

.user-pseudo {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0;
}

.user-progress {
  flex-shrink: 0;
  width: 180px; /* Fixed width for progress bars */
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
  
  .progress-card {
    padding: var(--spacing-4);
  }
  
  .progress-stats {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-3);
  }
  
  .goals-card {
    padding: var(--spacing-4);
  }
  
  .user-goal {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-3);
  }
  
  .user-info {
    justify-content: center;
  }
  
  .user-progress {
    width: 100%;
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
  
  .progress-stats {
    grid-template-columns: 1fr;
  }
  
  .user-avatar {
    width: var(--spacing-6);
    height: var(--spacing-6);
  }
  
  .user-name {
    font-size: var(--font-size-sm);
  }
  
  .user-pseudo {
    font-size: var(--font-size-xs);
  }
}
</style> 