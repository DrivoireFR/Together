<template>
  <AppLayout>
    <div class="group-detail-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement du groupe...</p>
      </div>
      
      <div v-else-if="groupStore.currentGroup" class="group-content">
        <!-- En-tête du groupe avec code de partage -->
        <BaseCard class="group-header-card">
          <div class="group-header-content">
            <div class="group-info">
              <h1 class="group-title">{{ groupStore.currentGroup.nom }}</h1>
            </div>
            <!-- <div class="share-section">
              <div class="share-code-container">
                <label class="share-label">Code de partage :</label>
                <div class="share-code-wrapper">
                  <span class="share-code">{{ groupStore.currentGroup.code }}</span>
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    @click="copyCodeToClipboard"
                    :disabled="copyingCode"
                    class="copy-button"
                  >
                    <span v-if="!codeCopied">📋 Copier</span>
                    <span v-else>✅ Copié !</span>
                  </BaseButton>
                </div>
                <p class="share-description">Partagez ce code pour inviter des membres</p>
              </div>
            </div> -->
          </div>
        </BaseCard>

        <RouterView />
      </div>
      
      <div v-else class="error-state">
        <h3 class="error-title">Groupe non trouvé</h3>
        <p class="error-description">Ce groupe n'existe pas ou vous n'y avez pas accès</p>
      </div>

      <TaskAcknowledgmentModal
        :show="tasksStore.showTaskAcknowledgmentModal"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useTasksStore } from '@/domain/stores/tasksStore'
import type { Tag } from '@/domain/types'
import AppLayout from '@/presentation/layouts/AppLayout.vue'
import TagFilter from '@/presentation/components/molecules/TagFilter.vue'
import BaseModal from '@/presentation/components/atoms/BaseModal.vue'
import BaseCard from '@/presentation/components/atoms/BaseCard.vue'
import CreateTagForm from '@/presentation/components/molecules/CreateTagForm.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import TaskAcknowledgmentModal from '@/presentation/components/molecules/TaskAcknowledgmentModal.vue'

const route = useRoute()
const groupStore = useGroupStore()
const tasksStore = useTasksStore()

// const copyingCode = ref(false)
// const codeCopied = ref(false)

const groupId = computed(() => Number(route.params.id))
const isLoading = computed(() => groupStore.isLoading || tasksStore.isLoading)

// Gestion des tags et filtres
const handleTagFilterChange = (tag: Tag | null) => {
  tasksStore.setTagFilter(tag)
}

// Copier le code de partage
// const copyCodeToClipboard = async () => {
//   if (!groupStore.currentGroup?.code) return
  
//   try {
//     copyingCode.value = true
//     await navigator.clipboard.writeText(groupStore.currentGroup.code)
//     codeCopied.value = true
    
//     // Remettre l'état initial après 2 secondes
//     setTimeout(() => {
//       codeCopied.value = false
//     }, 2000)
//   } catch (error) {
//     console.error('Erreur lors de la copie:', error)
//     // Fallback pour les navigateurs qui ne supportent pas l'API clipboard
//     try {
//       const textArea = document.createElement('textarea')
//       textArea.value = groupStore.currentGroup.code
//       document.body.appendChild(textArea)
//       textArea.select()
//       document.execCommand('copy')
//       document.body.removeChild(textArea)
//       codeCopied.value = true
//       setTimeout(() => {
//         codeCopied.value = false
//       }, 2000)
//     } catch (fallbackError) {
//       console.error('Erreur lors de la copie (fallback):', fallbackError)
//     }
//   } finally {
//     copyingCode.value = false
//   }
// }

// Initialisation
onMounted(() => {
  const id = groupId.value
  if (id && !isNaN(id)) {
      groupStore.fetchGroupById(id)
  }
})
</script>

<style scoped>
.group-detail-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
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

.group-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.group-header-card {
  margin-bottom: var(--spacing-2);
}

.group-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-6);
}

.group-info {
  flex: 1;
}

.group-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-3) 0;
}
.share-section {
  flex-shrink: 0;
}

.share-code-container {
  text-align: right;
}

.share-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-2);
}

.share-code-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-1);
}

.share-code {
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  border: 2px solid var(--color-primary-light);
  letter-spacing: 2px;
}

.copy-button {
  white-space: nowrap;
  transition: all 0.2s ease;
}

.share-description {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin: 0;
}

.group-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
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