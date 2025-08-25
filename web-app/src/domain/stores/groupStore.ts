import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { groupRepository } from '@/data/repositories/groupRepository'
import type { Group, CreateGroupPayload, StarterPack } from '../types'
import { useTasksStore } from './tasksStore'
import { useRouter } from 'vue-router'
import { StorageUtil } from '@/shared/utils/storage'
import { CacheService } from '@/shared/services/cacheService'
import router from '@/router'


export const useGroupStore = defineStore('group', () => {
  // State
  const groups = ref<Group[]>([])
  const currentGroup = ref<Group | null>(null)
  const searchResults = ref<Group[]>([])
  const isLoading = ref(false)
  const isBackgroundLoading = ref(false)
  const isSearching = ref(false)
  const error = ref<string | undefined>(undefined)
  
  // StarterPacks state
  const currentStarterPack = ref<StarterPack | null>(null)
  const createdGroupData = ref<{ group: Group; starterPack: StarterPack } | null>(null)
  const createdGroupId = ref<number | null>(null)
  
  // StarterPacks modal state
  const showGroupCreatedModal = ref(false)
  const showStarterPackTagsModal = ref(false)
  const showStarterPackTasksModal = ref(false)

  // Getters
  const groupsCount = computed(() => groups.value.length)
  const hasGroups = computed(() => groups.value.length > 0)
  const currentGroupName = computed(() => currentGroup.value?.nom || '')
  const currentGroupMembers = computed(() => currentGroup.value?.users || [])

  const tasksStore = useTasksStore()
  // Actions
  const fetchGroupById = async (id: number, useCache: boolean = true) => {
    if (currentGroup.value != null && currentGroup.value.id === id) return

    // Enregistrer le groupe visité
    CacheService.setLastVisitedGroup(id)

    // Essayer de charger depuis le cache d'abord
    if (useCache) {
      const cachedData = CacheService.getCachedGroupData(id)
      if (cachedData) {
        // Charger immédiatement depuis le cache (pas de loading)
        currentGroup.value = cachedData.group
        tasksStore.setTasks(cachedData.group.tasks)
        tasksStore.setTags(cachedData.group.tags)
        tasksStore.fetchRecentActionsByGroupId(id)
        
        // Démarrer la synchronisation en arrière-plan
        fetchGroupByIdBackground(id)
        return { group: cachedData.group, hotActions: cachedData.hotActions }
      }
    }

    // Si pas de cache ou cache désactivé, chargement normal avec loading
    isLoading.value = true
    error.value = undefined

    try {
      const result = await groupRepository.getGroupById(id)

      if (result.isSuccess) {
        currentGroup.value = result.data.group
        tasksStore.setTasks(result.data.group.tasks)
        tasksStore.setTags(result.data.group.tags)
        tasksStore.fetchRecentActionsByGroupId(id)
        
        // Mettre en cache les nouvelles données
        CacheService.cacheGroupData(id, result.data)
        
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

  // Méthode pour la synchronisation en arrière-plan
  const fetchGroupByIdBackground = async (id: number) => {
    isBackgroundLoading.value = true

    try {
      const result = await groupRepository.getGroupById(id)

      if (result.isSuccess) {
        // Mettre à jour les données en cache et l'interface
        CacheService.cacheGroupData(id, result.data)
        
        // Mettre à jour l'interface seulement si on affiche toujours ce groupe
        if (currentGroup.value?.id === id) {
          currentGroup.value = result.data.group
          tasksStore.setTasks(result.data.group.tasks)
          tasksStore.setTags(result.data.group.tags)
          tasksStore.fetchRecentActionsByGroupId(id)
        }
      }
    } catch (err) {
      // Ignorer les erreurs de synchronisation en arrière-plan
      console.warn('Synchronisation en arrière-plan échouée:', err)
    } finally {
      isBackgroundLoading.value = false
    }
  }

  const createGroup = async (payload: CreateGroupPayload) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await groupRepository.createGroup(payload)

      if (result.isSuccess) {
        groups.value.push(result.data.group)
        
        // Stocker les données pour les StarterPacks
        currentStarterPack.value = result.data.starterPack
        createdGroupData.value = {
          group: result.data.group,
          starterPack: result.data.starterPack
        }
        createdGroupId.value = result.data.group.id
        
        // Ouvrir la première modale du flow
        openGroupCreatedModal()
        
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

  // Modal flow actions
  const openGroupCreatedModal = () => {
    showGroupCreatedModal.value = true
  }
  const closeGroupCreatedModal = () => {
    showGroupCreatedModal.value = false
  }

  const openStarterPackTagsModal = () => {
    showStarterPackTagsModal.value = true
  }
  const closeStarterPackTagsModal = () => {
    showStarterPackTagsModal.value = false
  }

  const openStarterPackTasksModal = () => {
    showStarterPackTasksModal.value = true
  }
  const closeStarterPackTasksModal = () => {
    showStarterPackTasksModal.value = false
  }

  const startStarterPackSetup = () => {
    closeGroupCreatedModal()
    openStarterPackTagsModal()
  }

  const afterTagsCreated = () => {
    closeStarterPackTagsModal()
    openStarterPackTasksModal()
  }

  const finishGroupSetup = (groupId: number) => {
    // Nettoyer les données temporaires et fermer les modales
    resetStarterPackFlow()
    
    // Rediriger vers le groupe
    navigateToGroup(groupId)
  }

  const skipGroupSetup = (groupId: number) => {
    // Nettoyer les données temporaires et fermer les modales
    resetStarterPackFlow()
    
    // Rediriger vers le groupe
    navigateToGroup(groupId)
  }

  const resetStarterPackFlow = () => {
    closeGroupCreatedModal()
    closeStarterPackTagsModal()
    closeStarterPackTasksModal()
    currentStarterPack.value = null
    createdGroupData.value = null
    createdGroupId.value = null
  }

  const createBulkTags = async (groupId: number, tags: { label: string; color: string }[]) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await groupRepository.createBulkTags(groupId, { tags })

      if (result.isSuccess) {
        // Mettre à jour le groupe actuel si c'est celui-ci
        if (currentGroup.value?.id === groupId) {
          currentGroup.value.tags = [...currentGroup.value.tags, ...result.data.tags]
          tasksStore.setTags(currentGroup.value.tags)
        }
        
        return { success: true, tags: result.data.tags }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la création des catégories'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const createBulkTasks = async (groupId: number, tasks: any[]) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await groupRepository.createBulkTasks(groupId, { tasks })

      if (result.isSuccess) {
        // Mettre à jour le groupe actuel si c'est celui-ci
        if (currentGroup.value?.id === groupId) {
          currentGroup.value.tasks = [...currentGroup.value.tasks, ...result.data.tasks]
          tasksStore.setTasks(currentGroup.value.tasks)
        }
        
        return { success: true, tasks: result.data.tasks }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la création des tâches'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const navigateToGroup = (groupId: number) => {
    StorageUtil.setItem('selectedGroupId', String(groupId))
    router.push(`/groups/${groupId}`)
  }

  const searchGroupsByName = async (nom: string) => {
    if (!nom.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    error.value = undefined

    try {
      const result = await groupRepository.searchGroupsByName(nom)

      if (result.isSuccess) {
        const groupsYouDontJoined = result.data.groups.filter(group => !groups.value.some(g => g.id === group.id))
        searchResults.value = groupsYouDontJoined
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

  const getUserGroups = async (userId: number, useCache: boolean = true) => {
    // Essayer de charger depuis le cache d'abord
    if (useCache) {
      const cachedGroups = CacheService.getCachedUserGroups()
      if (cachedGroups) {
        groups.value = cachedGroups
        // Démarrer la synchronisation en arrière-plan
        getUserGroupsBackground(userId)
        return { success: true, groups: cachedGroups }
      }
    }

    isLoading.value = true
    error.value = undefined

    try {
      const result = await groupRepository.getUserGroups(userId)

      if (result.isSuccess) {
        groups.value = result.data.groups
        // Mettre en cache les groupes
        CacheService.cacheUserGroups(result.data.groups)
        return { success: true, groups: result.data.groups }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la récupération des groupes de l\'utilisateur'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Méthode pour la synchronisation en arrière-plan des groupes utilisateur
  const getUserGroupsBackground = async (userId: number) => {
    isBackgroundLoading.value = true

    try {
      const result = await groupRepository.getUserGroups(userId)

      if (result.isSuccess) {
        // Mettre à jour le cache et l'interface
        CacheService.cacheUserGroups(result.data.groups)
        groups.value = result.data.groups
      }
    } catch (err) {
      // Ignorer les erreurs de synchronisation en arrière-plan
      console.warn('Synchronisation des groupes en arrière-plan échouée:', err)
    } finally {
      isBackgroundLoading.value = false
    }
  }


  const joinGroup = async (groupId: number, code: string) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await groupRepository.joinGroup({ groupId, code })

      if (result.isSuccess) {
        // Recharger la liste des groupes pour refléter les changements
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
    error.value = undefined

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
    error.value = undefined

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
    error.value = undefined
  }

  const onGroupClick = (id: number) => {
    CacheService.setLastVisitedGroup(id)

    router.push(`/groups/${id}`)
  }

  const checkGroupAndRedirect = () => {
    // Priorité au nouveau système de cache
    let groupId = CacheService.getLastVisitedGroup()
    
    // Fallback vers l'ancien système si pas de groupe en cache
    if (!groupId) {
      const selectedGroupId = StorageUtil.getItem<string>('selectedGroupId')
      if (selectedGroupId) {
        groupId = parseInt(selectedGroupId, 10)
        // Migrer vers le nouveau système
        CacheService.setLastVisitedGroup(groupId)
      }
    }

    if (groupId) {
      router.push(`/groups/${groupId}`)
    }
  }

  // Nouvelle méthode pour initialiser les données depuis le cache
  const initializeFromCache = () => {
    // Charger la liste des groupes depuis le cache si disponible
    const cachedGroups = CacheService.getCachedUserGroups()
    if (cachedGroups) {
      groups.value = cachedGroups
      console.log('✓ Groupes chargés depuis le cache')
    }

    // Vérifier s'il y a un dernier groupe visité avec cache
    const lastGroupId = CacheService.getLastVisitedGroup()
    if (lastGroupId && CacheService.hasCachedData(lastGroupId)) {
      console.log(`✓ Dernier groupe visité (${lastGroupId}) a des données en cache`)
    }
  }

  return {
    // State
    groups,
    currentGroup,
    searchResults,
    isLoading,
    isBackgroundLoading,
    isSearching,
    error,
    currentStarterPack,
    createdGroupData,
    createdGroupId,
    showGroupCreatedModal,
    showStarterPackTagsModal,
    showStarterPackTasksModal,
    // Getters
    groupsCount,
    hasGroups,
    currentGroupName,
    currentGroupMembers,
    // Actions
    fetchGroupById,
    fetchGroupByIdBackground,
    getUserGroups,
    getUserGroupsBackground,
    createGroup,
    // modal flow
    openGroupCreatedModal,
    closeGroupCreatedModal,
    openStarterPackTagsModal,
    closeStarterPackTagsModal,
    openStarterPackTasksModal,
    closeStarterPackTasksModal,
    startStarterPackSetup,
    afterTagsCreated,
    finishGroupSetup,
    skipGroupSetup,
    resetStarterPackFlow,
    // bulk ops
    createBulkTags,
    createBulkTasks,
    // misc
    navigateToGroup,
    searchGroupsByName,
    joinGroup,
    leaveGroup,
    updateGroup,
    onGroupClick,
    checkGroupAndRedirect,
    initializeFromCache,
    clearSearchResults,
    clearCurrentGroup,
    clearError
  }
})