import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { groupRepository } from '@/data/repositories/groupRepository'
import type { Group, CreateGroupPayload, StarterPack } from '../types'
import { useTasksStore } from './tasksStore'
import { useAuthStore } from './authStore'
import { useRouter } from 'vue-router'
import { StorageUtil } from '@/shared/utils/storage'
import { STORAGE_KEYS } from '@/shared/constants'
import router from '@/router'


export const useGroupStore = defineStore('group', () => {
  // State
  const groups = ref<Group[]>([])
  const currentGroup = ref<Group | null>(null)
  const searchResults = ref<Group[]>([])
  const isLoading = ref(false)
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
  const authStore = useAuthStore()
  // Actions
  const fetchGroupById = async (id: number) => {
    if (currentGroup.value != null && currentGroup.value.id === id) return

    isLoading.value = true
    error.value = undefined

    try {
      // Vérifier d'abord si l'utilisateur a accès au groupe
      const userId = authStore.user?.id
      if (userId) {
        // Si les groupes ne sont pas encore chargés, les charger
        if (groups.value.length === 0) {
          await getUserGroups(userId)
        }

        // Vérifier que le groupe est dans la liste des groupes de l'utilisateur
        const hasAccess = groups.value.some(group => group.id === id)
        if (!hasAccess) {
          error.value = 'Vous n\'avez pas accès à ce groupe'
          return null
        }
      }

      const result = await groupRepository.getGroupById(id)

      if (result.isSuccess) {
        currentGroup.value = result.data.group
        tasksStore.setTasks(result.data.group.tasks)
        tasksStore.setTags(result.data.group.tags)
        tasksStore.fetchRecentActionsByGroupId(id)
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
    StorageUtil.setItem(STORAGE_KEYS.SELECTED_GROUP_ID, String(groupId))
    const groupRoute = {
      name: 'GroupCats',
      params: { id: groupId }
    }
    router.push(groupRoute)
  }

  const searchGroupsByName = async (nom: string) => {
    if (!nom.trim()) {
      searchResults.value = []
      return
    }

    // Le backend exige au moins 2 caractères
    if (nom.trim().length < 2) {
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

  const getUserGroups = async (userId: number) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await groupRepository.getUserGroups(userId)

      if (result.isSuccess) {
        groups.value = result.data.groups
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


  const joinGroup = async (groupId: number, code: string) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await groupRepository.joinGroup({ groupId, code })

      if (result.isSuccess) {
        // Recharger la liste des groupes pour refléter les changements
        return { success: true, groupId }
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

  const reset = () => {
    groups.value = []
    currentGroup.value = null
    searchResults.value = []
    isLoading.value = false
    isSearching.value = false
    error.value = undefined
    currentStarterPack.value = null
    createdGroupData.value = null
    createdGroupId.value = null
    showGroupCreatedModal.value = false
    showStarterPackTagsModal.value = false
    showStarterPackTasksModal.value = false
  }

  const onGroupClick = (id: number) => {
    StorageUtil.setItem(STORAGE_KEYS.SELECTED_GROUP_ID, String(id))

    const groupRoute = {
      name: 'GroupCats',
      params: { id: id }
    }
    router.push(groupRoute)
  }

  const checkGroupAndRedirect = async (userId?: number) => {
    const selectedGroupId = StorageUtil.getItem<string>(STORAGE_KEYS.SELECTED_GROUP_ID)
    if (!selectedGroupId) {
      return
    }

    // Charger les groupes de l'utilisateur si pas encore chargés
    if (groups.value.length === 0 && userId) {
      const result = await getUserGroups(userId)
      if (!result.success) {
        // Erreur lors du chargement des groupes, supprimer le selectedGroupId
        StorageUtil.removeItem(STORAGE_KEYS.SELECTED_GROUP_ID)
        return
      }
    }

    // Vérifier que l'utilisateur a accès au groupe sélectionné
    const hasAccess = groups.value.some(group => group.id === Number(selectedGroupId))

    if (hasAccess) {
      const groupRoute = {
        name: 'GroupCats',
        params: { id: Number(selectedGroupId) }
      }

      router.push(groupRoute)
    } else {
      // L'utilisateur n'a pas accès, supprimer le selectedGroupId
      StorageUtil.removeItem(STORAGE_KEYS.SELECTED_GROUP_ID)
    }
  }

  return {
    // State
    groups,
    currentGroup,
    searchResults,
    isLoading,
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
    getUserGroups,
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
    clearSearchResults,
    clearCurrentGroup,
    clearError,
    reset
  }
})