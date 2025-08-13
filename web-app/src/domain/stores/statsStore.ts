import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { statsRepository } from '@/data/repositories/statsRepository'
import type {
    GroupStatistics,
    Overview,
    PersonalGoal,
} from '@/shared/types/api'

export const useStatsStore = defineStore('stats', () => {
    // États
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const overview = ref<Overview | null>(null)

    // Getters
    const hasOverview = computed(() => overview.value !== null)

    // Actions
    const fetchOverview = async (groupId: number) => {
        isLoading.value = true
        error.value = null

        try {
            const result = await statsRepository.getOverview(groupId)

            if (result.isSuccess) {
                overview.value = result.data.overview
            } else {
                error.value = result.message
                overview.value = null
            }
        } catch (err) {
            error.value = 'Erreur lors de la récupération de l\'overview'
            overview.value = null
            console.error('Error fetching overview:', err)
        } finally {
            isLoading.value = false
        }
    }

    const clearStats = () => {
        overview.value = null
        error.value = null
        isLoading.value = false
    }

    // Getters calculés pour l'overview
    const totalMonthlyPoints = computed(() => {
        if (!overview.value) return 0
        return overview.value.totalTasksVolume
    })

    const completionPercentage = computed(() => {
        if (!overview.value || overview.value.totalTasksVolume === 0) return 0
        return Math.round((overview.value.totalDone / overview.value.totalTasksVolume) * 100)
    })

    const personalGoals = computed(() => {
        if (!overview.value) return [];

        return overview.value.users.map((user) => {
            const doneThisMonth = user.actions.reduce((total, action) => {
                return total + (action.task?.points ?? 0)
            }, 0)

            return {
                user,
                doneThisMonth
            }
        })
    })

    const topPerformers = computed(() => {
        if (!overview.value) return []

        const userStats: Record<string, { name: string; actions: number; points: number }> = {}

        for (const a of overview.value.actions) {
            const name =
                // adapte si tes types User incluent prénom/nom, sinon fallback
                // @ts-ignore potentiellement selon ton type User
                (a.user as any)?.prenom && (a.user as any)?.nom
                    // @ts-ignore
                    ? `${(a.user as any).prenom} ${(a.user as any).nom}`
                    : (a.user as any)?.email || String(a.user?.id)

            if (!userStats[name]) {
                userStats[name] = { name, actions: 0, points: 0 }
            }
            userStats[name].actions += 1
            userStats[name].points += a.task?.points ?? 0
        }

        return Object.values(userStats)
            .sort((a, b) => b.points - a.points)
            .slice(0, 5)
    })

    const helpingHandsCount = computed(() => {
        if (!overview.value) return 0
        return overview.value.actions.reduce((total, a) => total + (a.isHelpingHand ? 1 : 0), 0)
    })

    return {
        // États
        isLoading,
        error,
        overview,

        // Getters
        hasOverview,
        totalMonthlyPoints,
        completionPercentage,
        topPerformers,
        helpingHandsCount,
        personalGoals,

        // Actions
        fetchOverview,
        clearStats
    }
})