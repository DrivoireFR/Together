<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mes groupes</h1>
          <p class="text-gray-600">Gérez vos groupes et rejoignez-en de nouveaux</p>
        </div>
        
        <BaseButton @click="showCreateForm = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Créer un groupe
        </BaseButton>
      </div>
      
      <!-- Search section -->
      <BaseCard title="Rechercher des groupes">
        <div class="space-y-4">
          <BaseInput
            v-model="searchQuery"
            type="search"
            placeholder="Rechercher par nom de groupe..."
            :iconBefore="MagnifyingGlassIcon"
            @input="handleSearch"
          />
          
          <!-- Search results -->
          <div v-if="searchResults.length > 0" class="space-y-3">
            <h3 class="text-sm font-medium text-gray-700">Résultats de recherche :</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          
          <div v-else-if="searchQuery && !groupStore.isSearching" class="text-center py-8 text-gray-500">
            Aucun groupe trouvé pour "{{ searchQuery }}"
          </div>
        </div>
      </BaseCard>
      
      <!-- My groups -->
      <BaseCard title="Mes groupes">
        <div v-if="groupStore.isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">Chargement...</p>
        </div>
        
        <div v-else-if="groupStore.hasGroups" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        
        <div v-else class="text-center py-12">
          <UserGroupIcon class="h-12 w-12 text-gray-400 mx-auto" />
          <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun groupe</h3>
          <p class="mt-2 text-gray-500">Créez votre premier groupe ou rejoignez un groupe existant</p>
        </div>
      </BaseCard>
    </div>
    
    <!-- Create Group Modal -->
    <div v-if="showCreateForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Créer un nouveau groupe</h2>
          <CreateGroupForm
            :loading="groupStore.isLoading"
            :global-error="groupStore.error"
            @submit="handleCreateGroup"
            @cancel="showCreateForm = false"
          />
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
import type { Group, CreateGroupPayload } from '@/shared/types/api'

const router = useRouter()
const groupStore = useGroupStore()

// Local state
const showCreateForm = ref(false)
const searchQuery = ref('')
const joiningGroupId = ref<number | null>(null)
const leavingGroupId = ref<number | null>(null)

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
  joiningGroupId.value = groupId
  
  try {
    const result = await groupStore.joinGroup(groupId)
    if (result.success) {
      // Remove from search results since user joined
      groupStore.clearSearchResults()
      searchQuery.value = ''
    }
  } finally {
    joiningGroupId.value = null
  }
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
  router.push(`/groups/${group.id}`)
}

const handleGroupMenu = (group: Group) => {
  // TODO: Implement group menu (edit, delete, etc.)
  console.log('Group menu:', group)
}

// Lifecycle
onMounted(() => {
  groupStore.fetchGroups()
})
</script>