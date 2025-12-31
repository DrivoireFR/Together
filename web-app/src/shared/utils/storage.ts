import { STORAGE_PREFIX } from '../constants'

export class StorageUtil {
  /**
   * Génère la clé complète avec le préfixe de l'application
   */
  private static getPrefixedKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`
  }

  /**
   * Stocke une valeur dans le localStorage avec le préfixe de l'application
   */
  static setItem(key: string, value: any): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
      localStorage.setItem(this.getPrefixedKey(key), stringValue)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  /**
   * Récupère une valeur du localStorage avec le préfixe de l'application
   */
  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getPrefixedKey(key))
      if (!item) return null

      try {
        return JSON.parse(item) as T
      } catch {
        return item as T
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }

  /**
   * Supprime une valeur du localStorage avec le préfixe de l'application
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getPrefixedKey(key))
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }

  /**
   * Nettoie toutes les clés de l'application (avec le préfixe)
   */
  static clear(): void {
    try {
      const keysToRemove: string[] = []

      // Parcourir toutes les clés du localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key)
        }
      }

      // Supprimer uniquement les clés de l'application
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  /**
   * Nettoie TOUT le localStorage (à utiliser avec précaution)
   */
  static clearAll(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing all localStorage:', error)
    }
  }
}