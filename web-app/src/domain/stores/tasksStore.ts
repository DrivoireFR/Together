import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskRepository } from '@/data/repositories/taskRepository'
import type { Task, Tag, Action, UserTaskState, CreateTaskPayload, CreateTagPayload, CreateActionPayload, UpdateUserTaskStatePayload } from '@/shared/types/api'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const tags = ref<Tag[]>([])
  const currentTask = ref<Task | null>(null)
  const selectedTagFilter = ref<Tag | null>(null)
  const isLoading = ref(false)
  const error = ref<string | undefined>(undefined)
  
  // État pour la gestion de reconnaissance des tâches
  const unacknowledgedTasks = ref<Task[]>([])
  const currentUnacknowledgedTaskIndex = ref(0)
  const showTaskAcknowledgmentModal = ref(false)

  // Getters
  const tasksCount = computed(() => tasks.value.length)
  const tagsCount = computed(() => tags.value.length)
  const hasTasks = computed(() => tasks.value.length > 0)
  const hasTags = computed(() => tags.value.length > 0)
  
  const filteredTasks = computed(() => {
    if (!selectedTagFilter.value) {
      return tasks.value
    }
    return tasks.value.filter(task => task.tag?.id === selectedTagFilter.value!.id)
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
  const fetchTasksByGroupId = async (groupId: number) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.getTasksByGroupId(groupId)
      
      if (result.isSuccess) {
        tasks.value = result.data.tasks
      } else {
        error.value = result.message
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement des tâches'
    } finally {
      isLoading.value = false
    }
  }

  const fetchTagsByGroupId = async (groupId: number) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await taskRepository.getTagsByGroupId(groupId)
      
      if (result.isSuccess) {
        tags.value = result.data.tags
      } else {
        error.value = result.message
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement des tags'
    } finally {
      isLoading.value = false
    }
  }

  const fetchGroupData = async (groupId: number) => {
    isLoading.value = true
    error.value = undefined

    try {
      // Récupérer les tâches et tags en parallèle
      const [tasksResult, tagsResult] = await Promise.all([
        taskRepository.getTasksByGroupId(groupId),
        taskRepository.getTagsByGroupId(groupId)
      ])
      
      if (tasksResult.isSuccess) {
        tasks.value = tasksResult.data.tasks
        
        // Identifier les tâches non reconnues par l'utilisateur
        const newUnacknowledgedTasks = tasks.value.filter(task => 
          !task.userTaskState || !task.userTaskState.isAcknowledged
        )
        
        if (newUnacknowledgedTasks.length > 0) {
          unacknowledgedTasks.value = newUnacknowledgedTasks
          currentUnacknowledgedTaskIndex.value = 0
          showTaskAcknowledgmentModal.value = true
        }
      } else {
        error.value = tasksResult.message
      }

      if (tagsResult.isSuccess) {
        tags.value = tagsResult.data.tags
      } else {
        error.value = tagsResult.message
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement des données du groupe'
    } finally {
      isLoading.value = false
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

  const updateTask = async (id: number, payload: Partial<CreateTaskPayload>) => {
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
    isLoading.value = true
    error.value = undefined

    try {
      const payload: CreateActionPayload = {
        taskId,
        date: new Date().toISOString()
      }
      
      const result = await taskRepository.createAction(payload)
      
      if (result.isSuccess) {
        return { success: true, action: result.data.action }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la création de l\'action'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const setTagFilter = (tag: Tag | null) => {
    selectedTagFilter.value = tag
  }

  const clearTagFilter = () => {
    selectedTagFilter.value = null
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
    currentTask.value = null
    selectedTagFilter.value = null
    error.value = undefined
    unacknowledgedTasks.value = []
    currentUnacknowledgedTaskIndex.value = 0
    showTaskAcknowledgmentModal.value = false
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

  return {
    // State
    tasks,
    tags,
    currentTask,
    selectedTagFilter,
    isLoading,
    error,
    unacknowledgedTasks,
    currentUnacknowledgedTaskIndex,
    showTaskAcknowledgmentModal,
    // Getters
    tasksCount,
    tagsCount,
    hasTasks,
    hasTags,
    filteredTasks,
    tasksByTag,
    currentUnacknowledgedTask,
    hasUnacknowledgedTasks,
    isLastUnacknowledgedTask,
    // Actions
    fetchTasksByGroupId,
    fetchTagsByGroupId,
    fetchGroupData,
    createTask,
    createTag,
    updateTask,
    deleteTask,
    createActionForTask,
    setTagFilter,
    clearTagFilter,
    clearCurrentTask,
    clearError,
    clearData,
    acknowledgeTask,
    handleTaskDecision,
    closeTaskAcknowledgmentModal,
    skipTaskAcknowledgment
  }
})