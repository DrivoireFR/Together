import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskRepository } from '@/data/repositories/taskRepository'
import type { Task, Tag, CreateTaskPayload, CreateTagPayload } from '@/shared/types/api'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const tags = ref<Tag[]>([])
  const currentTask = ref<Task | null>(null)
  const selectedTagFilter = ref<Tag | null>(null)
  const isLoading = ref(false)
  const error = ref<string | undefined>(undefined)

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
  }

  return {
    // State
    tasks,
    tags,
    currentTask,
    selectedTagFilter,
    isLoading,
    error,
    // Getters
    tasksCount,
    tagsCount,
    hasTasks,
    hasTags,
    filteredTasks,
    tasksByTag,
    // Actions
    fetchTasksByGroupId,
    fetchTagsByGroupId,
    fetchGroupData,
    createTask,
    createTag,
    updateTask,
    deleteTask,
    setTagFilter,
    clearTagFilter,
    clearCurrentTask,
    clearError,
    clearData
  }
})