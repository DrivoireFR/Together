import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { statsRepository } from '@/data/repositories/statsRepository'
import type {
    GroupStatistics,
    Overview,
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
        return overview.value.monthlyVolume.reduce((sum, item) => sum + item.monthlyPoints, 0)
    })

    const completionPercentage = computed(() => {
        if (!overview.value || overview.value.summary.totalMonthlyVolumeAllCategories === 0) return 0
        return Math.round(
            (overview.value.summary.totalCompletedThisMonth / overview.value.summary.totalMonthlyVolumeAllCategories) * 100
        )
    })

    const topPerformers = computed(() => {
        if (!overview.value) return []

        const userStats: Record<string, { name: string; actions: number; points: number }> = {}

        Object.values(overview.value.actionsByDayAndUser).forEach(dayData => {
            Object.values(dayData).forEach(userData => {
                if (!userStats[userData.userName]) {
                    userStats[userData.userName] = {
                        name: userData.userName,
                        actions: 0,
                        points: 0
                    }
                }
                userStats[userData.userName].actions += userData.actions.length
                userStats[userData.userName].points += userData.actions.reduce((sum, action) => sum + action.points, 0)
            })
        })

        return Object.values(userStats)
            .sort((a, b) => b.points - a.points)
            .slice(0, 5)
    })

    const helpingHandsCount = computed(() => {
        if (!overview.value) return 0
        return Object.values(overview.value.helpingHandByUser)
            .reduce((total, user) => total + user.helpingHands.length, 0)
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

        // Actions
        fetchOverview,
        clearStats
    }
})