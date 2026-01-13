import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authRepository } from '@/data/repositories/authRepository'
import { StorageUtil } from '@/shared/utils/storage'
import { STORAGE_KEYS } from '@/shared/constants'
import type { User, LoginPayload, RegisterPayload, UpdateProfilePayload } from '../types'
import { useGroupStore } from './groupStore'
import { useTasksStore } from './tasksStore'
import { useStatsStore } from './statsStore'

export const useAuthStore = defineStore('auth', () => {
  // stores
  const groupStore = useGroupStore()
  const tasksStore = useTasksStore()
  const statsStore = useStatsStore()

  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | undefined>(undefined)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => user.value?.nom || '')
  const userEmail = computed(() => user.value?.email || '')

  // Actions
  const initializeAuth = async () => {
    // Nettoyage des anciennes clés sans préfixe (migration)
    const oldKeys = ['auth_token', 'user_data', 'remember_me', STORAGE_KEYS.SELECTED_GROUP_ID]
    oldKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key)
      }
    })

    const savedToken = StorageUtil.getItem<string>(STORAGE_KEYS.TOKEN)
    const savedUser = StorageUtil.getItem<User>(STORAGE_KEYS.USER)
    const savedRememberMe = StorageUtil.getItem<boolean>(STORAGE_KEYS.REMEMBER_ME)

    // Toujours restaurer l'état local d'abord
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
    }

    // Marquer comme terminé immédiatement pour éviter les boucles
    isLoading.value = false

    // Vérification en arrière-plan (non-bloquante)
    if (savedToken) {
      try {
        let verifyResult

        // Si remember me est activé, utiliser le endpoint remember-me
        if (savedRememberMe) {
          verifyResult = await authRepository.rememberMe()

          if (verifyResult.isSuccess) {
            // Mettre à jour le token (nouveau token standard 24h)
            token.value = verifyResult.data.token
            StorageUtil.setItem(STORAGE_KEYS.TOKEN, verifyResult.data.token)

            // Mettre à jour les données utilisateur
            setUserData(verifyResult.data.user)
            StorageUtil.setItem(STORAGE_KEYS.USER, verifyResult.data.user)

            // IMPORTANT: Resauvegarder le flag remember_me pour le prochain rechargement
            StorageUtil.setItem(STORAGE_KEYS.REMEMBER_ME, true)

            groupStore.checkGroupAndRedirect(verifyResult.data.user.id)
          } else {
            // Token remember me invalide ou expiré, déconnecter
            logout()
          }
        } else {
          // Token standard, vérifier normalement
          verifyResult = await authRepository.getProfile()

          if (verifyResult.isSuccess) {
            // Mettre à jour les données utilisateur
            setUserData(verifyResult.data.user)
            StorageUtil.setItem(STORAGE_KEYS.USER, verifyResult.data.user)

            groupStore.checkGroupAndRedirect(verifyResult.data.user.id)
          } else {
            // Token invalide, déconnecter silencieusement
            logout()
          }
        }
      } catch (err) {
        // Ignorer les erreurs réseau
        console.warn('Vérification du token échouée:', err)
      }
    }
  }

  const login = async (payload: LoginPayload) => {
    isLoading.value = true
    error.value = undefined

    try {
      const result = await authRepository.login(payload)

      if (result.isSuccess) {
        token.value = result.data.token

        setUserData(result.data.user)

        // Sauvegarder dans le localStorage
        StorageUtil.setItem(STORAGE_KEYS.TOKEN, result.data.token)
        StorageUtil.setItem(STORAGE_KEYS.USER, result.data.user)
        StorageUtil.setItem(STORAGE_KEYS.REMEMBER_ME, payload.rememberMe || false)

        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la connexion'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const setUserData = async (userData: User | undefined) => {
    if (!userData || !userData.id) {
      console.error('Données utilisateur invalides:', userData)
      return
    }
    user.value = userData
    groupStore.getUserGroups(userData.id)
  }

  const register = async (payload: RegisterPayload) => {
    isLoading.value = true
    error.value = undefined

    groupStore.reset()
    tasksStore.clearData()
    statsStore.clearStats()

    try {
      const result = await authRepository.register(payload)

      if (result.isSuccess) {
        token.value = result.data.token
        user.value = result.data.user

        // Sauvegarder dans le localStorage
        StorageUtil.setItem(STORAGE_KEYS.TOKEN, result.data.token)
        StorageUtil.setItem(STORAGE_KEYS.USER, result.data.user)

        // Charger les groupes du nouvel utilisateur
        await setUserData(result.data.user)

        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de l\'inscription'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    StorageUtil.removeItem(STORAGE_KEYS.REMEMBER_ME)
    error.value = undefined

    StorageUtil.removeItem(STORAGE_KEYS.TOKEN)
    StorageUtil.removeItem(STORAGE_KEYS.USER)
    StorageUtil.removeItem(STORAGE_KEYS.SELECTED_GROUP_ID)

    groupStore.reset()
    tasksStore.clearData()
    statsStore.clearStats()
  }

  const fetchProfile = async () => {
    if (!token.value) return

    isLoading.value = true

    try {
      const result = await authRepository.getProfile()

      if (result.isSuccess) {
        user.value = result.data.user
        StorageUtil.setItem(STORAGE_KEYS.USER, result.data.user)
      } else {
        // En cas d'erreur, déconnecter l'utilisateur
        logout()
      }
    } catch (err) {
      logout()
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (payload: UpdateProfilePayload) => {
    if (!token.value) {
      return { success: false, error: 'Non authentifié' }
    }

    isLoading.value = true
    error.value = undefined

    try {
      const result = await authRepository.updateProfile(payload)

      if (result.isSuccess) {
        user.value = result.data.user
        StorageUtil.setItem(STORAGE_KEYS.USER, result.data.user)
        return { success: true }
      } else {
        error.value = result.message
        return { success: false, error: result.message }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la mise à jour du profil'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = undefined
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    clearError
  }
})