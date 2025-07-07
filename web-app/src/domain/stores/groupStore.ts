import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { groupRepository } from '@/data/repositories/groupRepository'
import type { Group, CreateGroupPayload } from '@/shared/types/api'

export const useGroupStore = defineStore('group', () => {
  // State
  const groups = ref<Group[]>([])
  const currentGroup = ref<Group | null>(null)
  const searchResults = ref<Group[]>([])
  const isLoading = ref(false)
  const isSearching = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const groupsCount = computed(() => groups.value.length)
  const hasGroups = computed(() => groups.value.length > 0)
  const currentGroupName = computed(() => currentGroup.value?.nom || '')
  const currentGroupMembers = computed(() => currentGroup.value?.users || [])

  // Actions
  const fetchGroups = async () => {
    isLoading.value = true
    error.value = null

    try {
      const result = await groupRepository.getAllGroups()
      
      if (result.isSuccess) {
        groups.value = result.data
      } else {
        error.value = result.message
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement des groupes'
    } finally {
      isLoading.value = false
    }
  }

  const fetchGroupById = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await groupRepository.getGroupById(id)
      
      if (result.isSuccess) {
        currentGroup.value = result.data
        return result.data
      } else {
        error.value = result.message
        return null
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement du groupe'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createGroup = async (payload: CreateGroupPayload) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await groupRepository.createGroup(payload)
      
      if (result.isSuccess) {
        groups.value.push(result.data)
        return { success: true, group: result.data }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la création du groupe'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const searchGroupsByName = async (nom: string) => {
    if (!nom.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    error.value = null

    try {
      const result = await groupRepository.searchGroupsByName(nom)
      
      if (result.isSuccess) {
        searchResults.value = result.data
      } else {
        error.value = result.message
        searchResults.value = []
      }
    } catch (err) {
      error.value = 'Erreur lors de la recherche'
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  const joinGroup = async (groupId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await groupRepository.joinGroup(groupId)
      
      if (result.isSuccess) {
        // Recharger la liste des groupes pour refléter les changements
        await fetchGroups()
        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de l\'adhésion au groupe'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const leaveGroup = async (groupId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await groupRepository.leaveGroup(groupId)
      
      if (result.isSuccess) {
        // Retirer le groupe de la liste locale
        groups.value = groups.value.filter(g => g.id !== groupId)
        
        // Si c'est le groupe current, le vider
        if (currentGroup.value?.id === groupId) {
          currentGroup.value = null
        }
        
        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la sortie du groupe'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateGroup = async (id: number, payload: Partial<CreateGroupPayload>) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await groupRepository.updateGroup(id, payload)
      
      if (result.isSuccess) {
        // Mettre à jour le groupe dans la liste
        const index = groups.value.findIndex(g => g.id === id)
        if (index !== -1) {
          groups.value[index] = result.data
        }
        
        // Mettre à jour le groupe current si c'est lui
        if (currentGroup.value?.id === id) {
          currentGroup.value = result.data
        }
        
        return { success: true, group: result.data }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la modification du groupe'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const clearSearchResults = () => {
    searchResults.value = []
  }

  const clearCurrentGroup = () => {
    currentGroup.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    groups,
    currentGroup,
    searchResults,
    isLoading,
    isSearching,
    error,
    // Getters
    groupsCount,
    hasGroups,
    currentGroupName,
    currentGroupMembers,
    // Actions
    fetchGroups,
    fetchGroupById,
    createGroup,
    searchGroupsByName,
    joinGroup,
    leaveGroup,
    updateGroup,
    clearSearchResults,
    clearCurrentGroup,
    clearError
  }
})