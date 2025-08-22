<template>
  <AppLayout>
    <div class="groups-container">
      <!-- Header -->
      <div class="groups-header">
        <div class="header-text">
          <h1 class="page-title">Mes groupes</h1>
          <p class="page-subtitle">Gérez vos groupes et rejoignez-en de nouveaux</p>
        </div>
        
        <BaseButton @click="showCreateForm = true">
          <PlusIcon class="btn-icon-left" />
          Créer un groupe
        </BaseButton>
      </div>
      
      <!-- Search section -->
      <BaseCard title="Rechercher des groupes">
        <div class="search-container">
          <BaseInput
            v-model="searchQuery"
            type="search"
            placeholder="Rechercher par nom de groupe..."
            :iconBefore="MagnifyingGlassIcon"
            @input="handleSearch"
          />
          
          <!-- Search results -->
          <div v-if="searchResults.length > 0" class="search-results">
            <h3 class="search-results-title">Résultats de recherche :</h3>
            <div class="groups-grid">
              <GroupCard
                v-for="group in searchResults"
                :key="group.id"
                :group="group"
                :show-join-button="true"
                :joining-loading="joiningGroupId === group.id"
                :clickable="false"
                @join="handleJoinGroup"
              />
            </div>
          </div>
          
          <!-- <div v-else-if="searchQuery && !groupStore.isSearching" class="no-results">
            Aucun groupe trouvé pour "{{ searchQuery }}"
          </div> -->
        </div>
      </BaseCard>
      
      <!-- My groups -->
      <BaseCard title="Mes groupes">
        <div v-if="groupStore.isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">Chargement...</p>
        </div>
        
        <div v-else-if="groupStore.hasGroups" class="groups-grid groups-grid--large">
          <GroupCard
            v-for="group in groupStore.groups"
            :key="group.id"
            :group="group"
            :show-leave-button="true"
            :show-menu="true"
            :leaving-loading="leavingGroupId === group.id"
            @click="handleGroupClick"
            @leave="handleLeaveGroup"
            @menu="handleGroupMenu"
          />
        </div>
        
        <div v-else class="empty-state">
          <UserGroupIcon class="empty-icon" />
          <h3 class="empty-title">Aucun groupe</h3>
          <p class="empty-description">Créez votre premier groupe ou rejoignez un groupe existant</p>
        </div>
      </BaseCard>
    </div>
    
    <!-- Create Group Modal -->
    <div v-if="showCreateForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-body">
          <h2 class="modal-title">Créer un nouveau groupe</h2>
          <CreateGroupForm
            :loading="groupStore.isLoading"
            :global-error="groupStore.error"
            @submit="handleCreateGroup"
            @cancel="showCreateForm = false"
          />
        </div>
      </div>
    </div>

    <!-- Join Group Modal -->
    <div v-if="showJoinForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-body">
          <h2 class="modal-title">Rejoindre un groupe</h2>
          <p class="modal-description">
            Entrez le code de partage du groupe "{{ groupToJoin?.nom }}"
          </p>
          
          <form @submit.prevent="handleJoinGroupWithCode" class="join-form">
            <div class="form-group">
              <label for="groupCode" class="form-label">Code du groupe</label>
              <BaseInput
                id="groupCode"
                v-model="joinCode"
                placeholder="Ex: A1B2C3D4"
                :error="joinError"
                maxlength="8"
                class="join-code-input"
                required
              />
              <span v-if="joinError" class="form-error">{{ joinError }}</span>
            </div>
            
            <div class="modal-actions">
              <BaseButton
                type="button"
                variant="ghost"
                @click="cancelJoinGroup"
                :disabled="joiningGroupId !== null"
              >
                Annuler
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="joiningGroupId !== null"
                :disabled="!joinCode.trim()"
              >
                Rejoindre le groupe
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon 
} from '@heroicons/vue/24/outline'
import { useGroupStore } from '@/domain/stores/groupStore'
import AppLayout from '@/presentation/layouts/AppLayout.vue'
import BaseCard from '@/presentation/components/atoms/BaseCard.vue'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import GroupCard from '@/presentation/components/molecules/GroupCard.vue'
import CreateGroupForm from '@/presentation/components/molecules/CreateGroupForm.vue'
import type { Group, CreateGroupPayload } from '@/domain/types'

const router = useRouter()
const groupStore = useGroupStore()

// Local state
const showCreateForm = ref(false)
const showJoinForm = ref(false)
const searchQuery = ref('')
const joiningGroupId = ref<number | null>(null)
const leavingGroupId = ref<number | null>(null)
const groupToJoin = ref<Group | null>(null)
const joinCode = ref('')
const joinError = ref('')

// Computed
const searchResults = computed(() => groupStore.searchResults)

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    groupStore.searchGroupsByName(searchQuery.value)
  } else {
    groupStore.clearSearchResults()
  }
}

const handleCreateGroup = async (payload: CreateGroupPayload) => {
  const result = await groupStore.createGroup(payload)
  
  if (result.success) {
    showCreateForm.value = false
  }
}

const handleJoinGroup = async (groupId: number) => {
  // Trouver le groupe dans les résultats de recherche
  const group = searchResults.value.find(g => g.id === groupId)
  if (!group) return
  
  groupToJoin.value = group
  joinCode.value = ''
  joinError.value = ''
  showJoinForm.value = true
}

const handleJoinGroupWithCode = async () => {
  if (!groupToJoin.value || !joinCode.value.trim()) return
  
  joinError.value = ''
  joiningGroupId.value = groupToJoin.value.id
  
  try {
    const result = await groupStore.joinGroup(groupToJoin.value.id, joinCode.value.trim())
    if (result.success) {
      // Remove from search results since user joined
      groupStore.clearSearchResults()
      searchQuery.value = ''
      showJoinForm.value = false
      groupToJoin.value = null
      joinCode.value = ''
    } else {
      joinError.value = result.error || 'Erreur lors de la jointure'
    }
  } finally {
    joiningGroupId.value = null
  }
}

const cancelJoinGroup = () => {
  showJoinForm.value = false
  groupToJoin.value = null
  joinCode.value = ''
  joinError.value = ''
}

const handleLeaveGroup = async (groupId: number) => {
  if (confirm('Êtes-vous sûr de vouloir quitter ce groupe ?')) {
    leavingGroupId.value = groupId
    
    try {
      await groupStore.leaveGroup(groupId)
    } finally {
      leavingGroupId.value = null
    }
  }
}

const handleGroupClick = (group: Group) => {
  groupStore.onGroupClick(group.id)
}

const handleGroupMenu = (group: Group) => {
  // TODO: Implement group menu (edit, delete, etc.)
  console.log('Group menu:', group)
}

// Lifecycle
onMounted(() => {

})
</script>

<style scoped>
.groups-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.groups-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-text h1 {
  margin: 0;
}

.header-text p {
  margin: 0;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
}

.page-subtitle {
  color: var(--color-gray-600);
}

.btn-icon-left {
  width: var(--spacing-4);
  height: var(--spacing-4);
  margin-right: var(--spacing-2);
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.search-results-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin: 0;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--spacing-4);
}

.groups-grid--large {
  gap: var(--spacing-6);
}

.no-results {
  text-align: center;
  padding: var(--spacing-8) 0;
  color: var(--color-gray-500);
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

.empty-state {
  text-align: center;
  padding: var(--spacing-12) 0;
}

.empty-icon {
  width: var(--spacing-12);
  height: var(--spacing-12);
  color: var(--color-gray-400);
  margin: 0 auto var(--spacing-4);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-2) 0;
}

.empty-description {
  color: var(--color-gray-500);
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  z-index: var(--z-modal);
}

.modal-content {
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  max-width: 28rem;
  width: 100%;
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-4) 0;
}

.modal-description {
  color: var(--color-gray-600);
  margin: 0 0 var(--spacing-4) 0;
  line-height: 1.5;
}

.join-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.join-code-input {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
  font-weight: var(--font-weight-bold);
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-red-500);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  margin-top: var(--spacing-2);
}

/* Responsive grid */
@media (min-width: 768px) {
  .groups-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .groups-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>