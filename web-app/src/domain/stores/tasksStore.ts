import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskRepository } from '@/data/repositories/taskRepository'
import { statsRepository } from '@/data/repositories/statsRepository'
import type { Task, Tag, Action, UserTaskState, CreateTaskPayload, CreateTagPayload, UpdateTagPayload, CreateActionPayload, CreateActionForMemberPayload, UpdateUserTaskStatePayload, GroupStatistics, UpdateTaskPayload, HurryState, ActionAcknowledgment } from '../types'
import { useRoute, useRouter } from 'vue-router'
import { useConfirmModal } from '@/shared/composables/useConfirmModal'

export const useTasksStore = defineStore('tasks', () => {
  const route = useRoute()
  const router = useRouter()
  // State
  const tasks = ref<Task[]>([])
  const tags = ref<Tag[]>([])
  const actions = ref<Action[]>([])
  const statistics = ref<GroupStatistics | null>(null)
  const currentTask = ref<Task | null>(null)
  const selectedTagFilter = ref<Tag | null>(null)
  const sortByUrgency = ref(false)
  const isLoading = ref(false)
  const loadingTasks = ref<Set<number>>(new Set())
  const error = ref<string | undefined>(undefined)

  // État pour la gestion de reconnaissance des tâches
  const unacknowledgedTasks = ref<Task[]>([])
  const currentUnacknowledgedTaskIndex = ref(0)
  const showTaskAcknowledgmentModal = ref(false)

  // État pour la gestion des actions en attente de validation
  const pendingActionAcknowledgment = ref<ActionAcknowledgment[]>([])
  const currentPendingAcknowledgmentIndex = ref(0)
  const showActionAcknowledgmentModal = ref(false)

  // Getters
  const tasksCount = computed(() => tasks.value.length)
  const tagsCount = computed(() => tags.value.length)
  const actionsCount = computed(() => actions.value.length)
  const hasTasks = computed(() => tasks.value.length > 0)
  const hasTags = computed(() => tags.value.length > 0)
  const hasActions = computed(() => actions.value.length > 0)
  const hasStatistics = computed(() => statistics.value !== null)

  // Interactions (removed showfeedback and feedbackTotalDone - now using useConfirmModal)

  const filteredTasks = computed(() => {
    let filteredList = tasks.value

    // Apply tag filter
    if (selectedTagFilter.value) {
      filteredList = filteredList.filter(task => task.tag?.id === selectedTagFilter.value!.id)
    }

    // Apply urgency sorting
    if (sortByUrgency.value) {
      filteredList = [...filteredList].filter((a, b) => {
        const getUrgencyPriority = (hurryState: HurryState | undefined) => {
          switch (hurryState) {
            case 'yes': return 3
            case 'maybe': return 2
            case 'no': return 1
            default: return 0
          }
        }

        const priorityA = getUrgencyPriority(a.hurryState)
        // const priorityB = getUrgencyPriority(b.hurryState)

        // Sort in descending order (most urgent first)
        return priorityA
      })
    }

    return filteredList
  })

  const tasksByTag = computed(() => {
    const groupedTasks: Record<string, Task[]> = {}
    tasks.value.forEach(task => {
      const tagLabel = task.tag?.label || 'Sans tag'
      if (!groupedTasks[tagLabel]) {
        groupedTasks[tagLabel] = []
      }
      groupedTasks[tagLabel].push(task)
    })
    return groupedTasks
  })

  const currentUnacknowledgedTask = computed(() => {
    return unacknowledgedTasks.value[currentUnacknowledgedTaskIndex.value] || null
  })

  const hasUnacknowledgedTasks = computed(() => {
    return unacknowledgedTasks.value.length > 0
  })

  const isLastUnacknowledgedTask = computed(() => {
    return currentUnacknowledgedTaskIndex.value >= unacknowledgedTasks.value.length - 1
  })

  // Actions
  const setTasks = (items: Task[]) => {
    tasks.value = items
    _handleNewTasks()
  }

  const setTags = (items: Tag[]) => {
    tags.value = items
  }

  const _handleNewTasks = () => {
    // Identifier les tâches non reconnues par l'utilisateur
    const newUnacknowledgedTasks = tasks.value.filter(task =>
      !task.userTaskState || !task.userTaskState.isAcknowledged
    )

    if (newUnacknowledgedTasks.length > 0) {
      unacknowledgedTasks.value = newUnacknowledgedTasks
      currentUnacknowledgedTaskIndex.value = 0
      showTaskAcknowledgmentModal.value = true
    }
  }

  const createTask = async (payload: CreateTaskPayload) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.createTask(payload)

      if (result.isSuccess) {
        tasks.value.push(result.data.task)
        return { success: true, task: result.data.task }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la création de la tâche'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const createTag = async (payload: CreateTagPayload) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.createTag(payload)

      if (result.isSuccess) {
        tags.value.push(result.data.tag)
        return { success: true, tag: result.data.tag }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la création du tag'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateTag = async (payload: UpdateTagPayload) => {
    if (!selectedTagFilter.value) return
    const id: number = selectedTagFilter.value.id
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.updateTag(id, payload)

      if (result.isSuccess) {
        const index = tags.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tags.value[index] = result.data.tag
        }
        const groupId = route.params.id
        const groupRoute = {
          name: 'GroupCats',
          params: { id: groupId }
        }
        router.push(groupRoute)
        return { success: true, tag: result.data.tag }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la modification du tag'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const deleteTag = (tag: Tag) => {
    useConfirmModal()
      .title('Supprimer le tag')
      .description('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible. Les tâches seronts conservée')
      .confirmLabel('Supprimer')
      .cancelLabel('Annuler')
      .onConfirm(async () => {
        isLoading.value = true
        error.value = undefined

        try {
          const result = await taskRepository.deleteTag(tag.id)

          if (result.isSuccess) {
            tags.value = tags.value.filter(t => t.id !== tag.id)

            // Si le tag supprimé était le filtre actif, le réinitialiser
            if (selectedTagFilter.value?.id === tag.id) {
              selectedTagFilter.value = null
            }
          } else {
            error.value = result.message
          }
        } catch (err) {
          const errorMessage = 'Erreur lors de la suppression du tag'
          error.value = errorMessage
        } finally {
          isLoading.value = false
        }
      })
      .open()
  }

  const fetchTags = async () => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.getAllTags()
      if (result.isSuccess) {
        tags.value = result.data.tags
        return { success: true, tags: result.data.tags }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la récupération des tags'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateTask = async (id: number, payload: UpdateTaskPayload) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.updateTask(id, payload)

      if (result.isSuccess) {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index] = result.data.task
        }

        if (currentTask.value?.id === id) {
          currentTask.value = result.data.task
        }

        return { success: true, task: result.data.task }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la modification de la tâche'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const deleteTask = async (id: number) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.deleteTask(id)

      if (result.isSuccess) {
        tasks.value = tasks.value.filter(t => t.id !== id)

        if (currentTask.value?.id === id) {
          currentTask.value = null
        }

        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la suppression de la tâche'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const createActionForTask = async (taskId: number) => {
    loadingTasks.value.add(taskId)
    error.value = undefined

    try {
      const payload: CreateActionPayload = {
        taskId,
        date: new Date().toISOString()
      }

      const result = await taskRepository.createAction(payload)

      if (result.isSuccess) {
        // Recharger les actions pour mettre à jour l'historique
        const groupId = Number(route.params.id)
        if (!isNaN(groupId)) {
          await fetchRecentActionsByGroupId(groupId, true)
        }

        // Afficher la modale de feedback avec navigation
        if (!isNaN(groupId)) {
          useConfirmModal()
            .title('Action créée avec succès')
            .description(`Vous avez maintenant ${result.data.totalDone} points ce mois-ci !`)
            .confirmLabel('Continuer')
            .cancelLabel('')
            .onConfirm(async () => {
              // Naviguer vers la page d'accueil du groupe si on n'y est pas déjà
              if (route.name !== 'GroupCats') {
                await router.push({
                  name: 'GroupCats',
                  params: { id: groupId }
                })
              }
            })
            .open()
        }

        return { success: true, action: result.data.action, totalDone: result.data.totalDone }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la création de l\'action'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loadingTasks.value.delete(taskId)
    }
  }

  const isTaskLoading = (taskId: number) => {
    return loadingTasks.value.has(taskId)
  }

  const deleteAction = async (actionId: number) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.deleteAction(actionId)

      if (result.isSuccess) {
        actions.value = actions.value.filter((action) => action.id !== actionId)
        return { success: true, action: result.data }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la suppression de l\'action'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const fetchRecentActionsByGroupId = async (groupId: number, silent = false) => {
    if (!silent) {
      isLoading.value = true
    }
    error.value = undefined

    try {
      const result = await taskRepository.getRecentActionsByGroupId(groupId)

      if (result.isSuccess) {
        actions.value = result.data.actions
        return { success: true, actions: result.data.actions, total: result.data.total }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors du chargement des actions récentes'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      if (!silent) {
        isLoading.value = false
      }
    }
  }

  const setTagFilter = (tag: Tag | null) => {
    selectedTagFilter.value = tag
    const id = route.params.id
    const tasksRoute = {
      name: 'GroupHomeTasks',
      params: { id: id }
    }
    router.push(tasksRoute)
  }

  const onModifyTag = (tag: Tag) => {
    selectedTagFilter.value = tag
    const id = route.params.id
    const editTagRoute = {
      name: 'GroupEditTag',
      params: { id: id, tagId: tag.id }
    }
    router.push(editTagRoute)
  }

  const onCancelTagEdit = () => {
    selectedTagFilter.value = null
    const id = route.params.id
    const GroupRoute = {
      name: 'GroupCats',
      params: { id: id }
    }
    router.push(GroupRoute)
  }

  const clearTagFilter = () => {
    selectedTagFilter.value = null
  }

  const setSortByUrgency = (enabled: boolean) => {
    sortByUrgency.value = enabled
  }

  const onUrgencyCatTap = () => {
    sortByUrgency.value = !sortByUrgency.value
    const id = route.params.id
    const tasksRoute = {
      name: 'GroupHomeTasks',
      params: { id: id }
    }
    router.push(tasksRoute)
  }

  const clearCurrentTask = () => {
    currentTask.value = null
  }

  const clearError = () => {
    error.value = undefined
  }

  const clearData = () => {
    tasks.value = []
    tags.value = []
    actions.value = []
    statistics.value = null
    currentTask.value = null
    selectedTagFilter.value = null
    error.value = undefined
    unacknowledgedTasks.value = []
    currentUnacknowledgedTaskIndex.value = 0
    showTaskAcknowledgmentModal.value = false
    pendingActionAcknowledgment.value = []
    currentPendingAcknowledgmentIndex.value = 0
    showActionAcknowledgmentModal.value = false
  }

  // Actions pour la gestion de reconnaissance des tâches
  const acknowledgeTask = async (taskId: number, isConcerned: boolean) => {
    try {
      const payload: UpdateUserTaskStatePayload = {
        isAcknowledged: true,
        isConcerned
      }

      const result = await taskRepository.updateUserTaskState(taskId, payload)

      if (result.isSuccess) {
        // Mettre à jour la tâche dans la liste locale
        const taskIndex = tasks.value.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
          tasks.value[taskIndex].userTaskState = result.data.userTaskState
        }

        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la mise à jour de l\'état de la tâche'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const handleTaskDecision = async (isConcerned: boolean) => {
    const currentTask = currentUnacknowledgedTask.value
    if (!currentTask) return

    const result = await acknowledgeTask(currentTask.id, isConcerned)

    if (result.success) {
      // Passer à la tâche suivante ou fermer la modale
      if (isLastUnacknowledgedTask.value) {
        closeTaskAcknowledgmentModal()
      } else {
        currentUnacknowledgedTaskIndex.value++
      }
    }
  }

  const closeTaskAcknowledgmentModal = () => {
    showTaskAcknowledgmentModal.value = false
    unacknowledgedTasks.value = []
    currentUnacknowledgedTaskIndex.value = 0
  }

  const skipTaskAcknowledgment = () => {
    if (isLastUnacknowledgedTask.value) {
      closeTaskAcknowledgmentModal()
    } else {
      currentUnacknowledgedTaskIndex.value++
    }
  }

  // Actions pour créer une action pour un autre membre
  const createActionForMember = async (taskId: number, memberId: number) => {
    loadingTasks.value.add(taskId)
    error.value = undefined

    try {
      const payload: CreateActionForMemberPayload = {
        taskId,
        date: new Date().toISOString(),
        userId: memberId
      }

      const result = await taskRepository.createActionForMember(payload)

      if (result.isSuccess) {
        // Recharger les actions pour mettre à jour l'historique
        const groupId = Number(route.params.id)
        if (!isNaN(groupId)) {
          await fetchRecentActionsByGroupId(groupId, true)
        }

        // Afficher la modale de feedback avec navigation
        if (!isNaN(groupId)) {
          useConfirmModal()
            .title('Action créée avec succès')
            .description(`L'action a été déclarée. Total du mois : ${result.data.totalDone} points.`)
            .confirmLabel('Continuer')
            .cancelLabel('')
            .onConfirm(async () => {
              // Naviguer vers la page d'accueil du groupe si on n'y est pas déjà
              if (route.name !== 'GroupCats') {
                await router.push({
                  name: 'GroupCats',
                  params: { id: groupId }
                })
              }
            })
            .open()
        }

        return { success: true, action: result.data.action, totalDone: result.data.totalDone }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la création de l\'action pour le membre'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loadingTasks.value.delete(taskId)
    }
  }

  // Actions pour la gestion des acknowledgments d'actions
  const fetchPendingActionAcknowledgment = async () => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.getPendingActionAcknowledgment()

      if (result.isSuccess) {
        pendingActionAcknowledgment.value = result.data.acknowledgments
        currentPendingAcknowledgmentIndex.value = 0

        // Ouvrir la modale si des acknowledgments sont en attente
        if (result.data.acknowledgments.length > 0) {
          showActionAcknowledgmentModal.value = true
        }

        return { success: true, acknowledgments: result.data.acknowledgments }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors du chargement des actions en attente'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const currentPendingAcknowledgment = computed(() => {
    return pendingActionAcknowledgment.value[currentPendingAcknowledgmentIndex.value] || null
  })

  const hasPendingAcknowledgment = computed(() => {
    return pendingActionAcknowledgment.value.length > 0
  })

  const isLastPendingAcknowledgment = computed(() => {
    return currentPendingAcknowledgmentIndex.value >= pendingActionAcknowledgment.value.length - 1
  })

  const acceptActionAcknowledgment = async (ackId: number) => {
    try {
      const result = await taskRepository.acceptActionAcknowledgment(ackId)

      if (result.isSuccess) {
        // Retirer l'acknowledgment de la liste
        pendingActionAcknowledgment.value = pendingActionAcknowledgment.value.filter(
          ack => ack.id !== ackId
        )

        // Recharger les actions pour mettre à jour l'historique
        const groupId = Number(route.params.id)
        if (!isNaN(groupId)) {
          await fetchRecentActionsByGroupId(groupId, true)
        }

        // Passer à l'acknowledgment suivant ou fermer la modale
        if (pendingActionAcknowledgment.value.length === 0) {
          closeActionAcknowledgmentModal()
        } else if (currentPendingAcknowledgmentIndex.value >= pendingActionAcknowledgment.value.length) {
          currentPendingAcknowledgmentIndex.value = pendingActionAcknowledgment.value.length - 1
        }

        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de l\'acceptation de l\'action'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const rejectActionAcknowledgment = async (ackId: number) => {
    try {
      const result = await taskRepository.rejectActionAcknowledgment(ackId)

      if (result.isSuccess) {
        // Retirer l'acknowledgment de la liste
        pendingActionAcknowledgment.value = pendingActionAcknowledgment.value.filter(
          ack => ack.id !== ackId
        )

        // Recharger les actions pour mettre à jour l'historique (l'action rejetée sera supprimée)
        const groupId = Number(route.params.id)
        if (!isNaN(groupId)) {
          await fetchRecentActionsByGroupId(groupId, true)
        }

        // Passer à l'acknowledgment suivant ou fermer la modale
        if (pendingActionAcknowledgment.value.length === 0) {
          closeActionAcknowledgmentModal()
        } else if (currentPendingAcknowledgmentIndex.value >= pendingActionAcknowledgment.value.length) {
          currentPendingAcknowledgmentIndex.value = pendingActionAcknowledgment.value.length - 1
        }

        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors du refus de l\'action'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  const handleActionAcknowledgmentDecision = async (accept: boolean) => {
    const currentAck = currentPendingAcknowledgment.value
    if (!currentAck) return

    if (accept) {
      await acceptActionAcknowledgment(currentAck.id)
    } else {
      await rejectActionAcknowledgment(currentAck.id)
    }
  }

  const closeActionAcknowledgmentModal = () => {
    showActionAcknowledgmentModal.value = false
    pendingActionAcknowledgment.value = []
    currentPendingAcknowledgmentIndex.value = 0
  }

  const skipActionAcknowledgment = () => {
    if (isLastPendingAcknowledgment.value) {
      closeActionAcknowledgmentModal()
    } else {
      currentPendingAcknowledgmentIndex.value++
    }
  }

  return {
    // State
    tasks,
    tags,
    actions,
    statistics,
    currentTask,
    selectedTagFilter,
    sortByUrgency,
    isLoading,
    error,
    unacknowledgedTasks,
    currentUnacknowledgedTaskIndex,
    showTaskAcknowledgmentModal,
    pendingActionAcknowledgment,
    currentPendingAcknowledgmentIndex,
    showActionAcknowledgmentModal,
    // Getters
    tasksCount,
    tagsCount,
    actionsCount,
    hasTasks,
    hasTags,
    hasActions,
    hasStatistics,
    filteredTasks,
    tasksByTag,
    currentUnacknowledgedTask,
    hasUnacknowledgedTasks,
    isLastUnacknowledgedTask,
    currentPendingAcknowledgment,
    hasPendingAcknowledgment,
    isLastPendingAcknowledgment,
    // Actions
    setTasks,
    setTags,
    fetchRecentActionsByGroupId,
    createTask,
    createTag,
    updateTag,
    deleteTag,
    updateTask,
    deleteTask,
    createActionForTask,
    createActionForMember,
    isTaskLoading,
    deleteAction,
    fetchPendingActionAcknowledgment,
    acceptActionAcknowledgment,
    rejectActionAcknowledgment,
    handleActionAcknowledgmentDecision,
    closeActionAcknowledgmentModal,
    skipActionAcknowledgment,
    setTagFilter,
    onCancelTagEdit,
    onModifyTag,
    clearTagFilter,
    setSortByUrgency,
    onUrgencyCatTap,
    clearCurrentTask,
    clearError,
    clearData,
    acknowledgeTask,
    handleTaskDecision,
    closeTaskAcknowledgmentModal,
    skipTaskAcknowledgment,
    //Interactions
  }
})