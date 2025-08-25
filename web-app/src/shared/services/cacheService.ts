import { StorageUtil } from '@/shared/utils/storage'
import { STORAGE_KEYS } from '@/shared/constants'
import type { Group, FetchGroupResponse } from '@/domain/types'

export interface CachedGroupData {
  group: Group
  hotActions?: {
    count: number
    tasks: any[]
  }
  timestamp: number
}

export interface CachedUserGroups {
  groups: Group[]
  timestamp: number
}

export class CacheService {
  // Durée de validité du cache en millisecondes (5 minutes)
  private static readonly CACHE_DURATION = 5 * 60 * 1000
  // Durée maximale de rétention des caches (24 heures)
  private static readonly MAX_CACHE_AGE = 24 * 60 * 60 * 1000

  /**
   * Met en cache les données d'un groupe spécifique
   */
  static cacheGroupData(groupId: number, data: FetchGroupResponse): void {
    try {
      const cachedData: CachedGroupData = {
        group: data.group,
        hotActions: data.hotActions,
        timestamp: Date.now()
      }
      
      const cacheKey = `${STORAGE_KEYS.GROUP_CACHE}${groupId}`
      StorageUtil.setItem(cacheKey, cachedData)
      
      // Mettre à jour le timestamp du cache
      StorageUtil.setItem(`${STORAGE_KEYS.CACHE_TIMESTAMP}${groupId}`, Date.now())
      
      console.log(`✓ Données du groupe ${groupId} mises en cache`)
    } catch (error) {
      console.error('Erreur lors de la mise en cache du groupe:', error)
    }
  }

  /**
   * Récupère les données en cache d'un groupe si elles sont valides
   */
  static getCachedGroupData(groupId: number): CachedGroupData | null {
    try {
      const cacheKey = `${STORAGE_KEYS.GROUP_CACHE}${groupId}`
      const cachedData = StorageUtil.getItem<CachedGroupData>(cacheKey)
      
      if (!cachedData) {
        return null
      }

      // Vérifier si le cache est encore valide
      if (this.isCacheValid(cachedData.timestamp)) {
        console.log(`✓ Cache valide trouvé pour le groupe ${groupId}`)
        return cachedData
      } else {
        console.log(`⚠ Cache expiré pour le groupe ${groupId}`)
        this.clearGroupCache(groupId)
        return null
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du cache du groupe:', error)
      return null
    }
  }

  /**
   * Met en cache la liste des groupes de l'utilisateur
   */
  static cacheUserGroups(groups: Group[]): void {
    try {
      const cachedGroups: CachedUserGroups = {
        groups,
        timestamp: Date.now()
      }
      
      StorageUtil.setItem(STORAGE_KEYS.USER_GROUPS, cachedGroups)
      console.log(`✓ Liste des groupes utilisateur mise en cache (${groups.length} groupes)`)
    } catch (error) {
      console.error('Erreur lors de la mise en cache des groupes utilisateur:', error)
    }
  }

  /**
   * Récupère la liste des groupes en cache si elle est valide
   */
  static getCachedUserGroups(): Group[] | null {
    try {
      const cachedGroups = StorageUtil.getItem<CachedUserGroups>(STORAGE_KEYS.USER_GROUPS)
      
      if (!cachedGroups) {
        return null
      }

      if (this.isCacheValid(cachedGroups.timestamp)) {
        console.log(`✓ Cache valide trouvé pour les groupes utilisateur (${cachedGroups.groups.length} groupes)`)
        return cachedGroups.groups
      } else {
        console.log('⚠ Cache expiré pour les groupes utilisateur')
        this.clearUserGroupsCache()
        return null
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du cache des groupes utilisateur:', error)
      return null
    }
  }

  /**
   * Enregistre le dernier groupe visité
   */
  static setLastVisitedGroup(groupId: number): void {
    try {
      StorageUtil.setItem(STORAGE_KEYS.LAST_GROUP_ID, groupId)
      console.log(`✓ Dernier groupe visité enregistré: ${groupId}`)
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du dernier groupe visité:', error)
    }
  }

  /**
   * Récupère le dernier groupe visité
   */
  static getLastVisitedGroup(): number | null {
    try {
      const groupId = StorageUtil.getItem<number>(STORAGE_KEYS.LAST_GROUP_ID)
      return groupId
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier groupe visité:', error)
      return null
    }
  }

  /**
   * Vérifie si un cache est encore valide
   */
  private static isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION
  }

  /**
   * Supprime le cache d'un groupe spécifique
   */
  static clearGroupCache(groupId: number): void {
    try {
      const cacheKey = `${STORAGE_KEYS.GROUP_CACHE}${groupId}`
      const timestampKey = `${STORAGE_KEYS.CACHE_TIMESTAMP}${groupId}`
      
      StorageUtil.removeItem(cacheKey)
      StorageUtil.removeItem(timestampKey)
      
      console.log(`✓ Cache du groupe ${groupId} supprimé`)
    } catch (error) {
      console.error('Erreur lors de la suppression du cache du groupe:', error)
    }
  }

  /**
   * Supprime le cache des groupes utilisateur
   */
  static clearUserGroupsCache(): void {
    try {
      StorageUtil.removeItem(STORAGE_KEYS.USER_GROUPS)
      console.log('✓ Cache des groupes utilisateur supprimé')
    } catch (error) {
      console.error('Erreur lors de la suppression du cache des groupes utilisateur:', error)
    }
  }

  /**
   * Supprime tout le cache lié aux groupes
   */
  static clearAllGroupCaches(): void {
    try {
      // Supprimer le dernier groupe visité
      StorageUtil.removeItem(STORAGE_KEYS.LAST_GROUP_ID)
      
      // Supprimer le cache des groupes utilisateur
      this.clearUserGroupsCache()
      
      // Note: Les caches individuels des groupes pourraient être supprimés ici
      // mais nous les gardons pour l'instant car ils peuvent être utiles
      
      console.log('✓ Tous les caches des groupes supprimés')
    } catch (error) {
      console.error('Erreur lors de la suppression de tous les caches des groupes:', error)
    }
  }

  /**
   * Vérifie si des données en cache existent pour un groupe
   */
  static hasCachedData(groupId: number): boolean {
    const cachedData = this.getCachedGroupData(groupId)
    return cachedData !== null
  }

  /**
   * Nettoie les caches expirés et anciens
   */
  static cleanupExpiredCaches(): void {
    try {
      const now = Date.now()
      let cleanedCount = 0

      // Parcourir tous les éléments du localStorage
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (!key) continue

        // Vérifier si c'est un cache de groupe
        if (key.startsWith(STORAGE_KEYS.GROUP_CACHE) || 
            key.startsWith(STORAGE_KEYS.CACHE_TIMESTAMP)) {
          try {
            const item = StorageUtil.getItem<CachedGroupData>(key)
            if (item?.timestamp && (now - item.timestamp > this.MAX_CACHE_AGE)) {
              StorageUtil.removeItem(key)
              cleanedCount++
            }
          } catch {
            // Supprimer les éléments corrompus
            StorageUtil.removeItem(key)
            cleanedCount++
          }
        }
      }

      // Nettoyer le cache des groupes utilisateur s'il est trop ancien
      const userGroups = StorageUtil.getItem<CachedUserGroups>(STORAGE_KEYS.USER_GROUPS)
      if (userGroups?.timestamp && (now - userGroups.timestamp > this.MAX_CACHE_AGE)) {
        this.clearUserGroupsCache()
        cleanedCount++
      }

      if (cleanedCount > 0) {
        console.log(`✓ ${cleanedCount} cache(s) expiré(s) nettoyé(s)`)
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des caches:', error)
    }
  }

  /**
   * Force le rafraîchissement d'un cache de groupe
   */
  static async forceRefreshGroupCache(groupId: number, groupRepository: any): Promise<void> {
    try {
      console.log(`🔄 Rafraîchissement forcé du cache pour le groupe ${groupId}`)
      
      // Supprimer l'ancien cache
      this.clearGroupCache(groupId)
      
      // Récupérer les nouvelles données
      const result = await groupRepository.getGroupById(groupId)
      
      if (result.isSuccess) {
        this.cacheGroupData(groupId, result.data)
        console.log(`✓ Cache du groupe ${groupId} rafraîchi`)
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du cache:', error)
    }
  }

  /**
   * Initialise le service de cache (nettoyage automatique)
   */
  static initialize(): void {
    // Nettoyer les caches expirés au démarrage
    this.cleanupExpiredCaches()
    
    // Programmer un nettoyage périodique (toutes les heures)
    setInterval(() => {
      this.cleanupExpiredCaches()
    }, 60 * 60 * 1000)
    
    console.log('✓ Service de cache initialisé')
  }

  /**
   * Retourne des statistiques sur le cache
   */
  static getCacheStats(): {
    lastVisitedGroup: number | null
    hasUserGroupsCache: boolean
    cachedGroupsCount: number
    totalCacheSize: number
  } {
    const lastVisitedGroup = this.getLastVisitedGroup()
    const userGroups = this.getCachedUserGroups()
    
    // Calculer la taille approximative du cache
    let totalCacheSize = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith(STORAGE_KEYS.GROUP_CACHE) || 
                  key.startsWith(STORAGE_KEYS.CACHE_TIMESTAMP) ||
                  key === STORAGE_KEYS.USER_GROUPS ||
                  key === STORAGE_KEYS.LAST_GROUP_ID)) {
        const item = localStorage.getItem(key)
        if (item) {
          totalCacheSize += item.length
        }
      }
    }
    
    return {
      lastVisitedGroup,
      hasUserGroupsCache: userGroups !== null,
      cachedGroupsCount: userGroups?.length || 0,
      totalCacheSize
    }
  }
}