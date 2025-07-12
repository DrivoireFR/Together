import { apiClient } from './apiClient'
import { mockApiClient } from '../mocks/mockApiClient'
import { IS_DEMO_MODE } from '@/shared/constants'

// Factory pour créer le bon client selon le mode
export const createApiClient = (): any => {
  if (IS_DEMO_MODE) {
    console.log('🎭 Mode démo activé - Utilisation des données mockées')
    return mockApiClient
  }
  
  console.log('🔌 Mode API réel activé')
  return apiClient
}

// Instance exportée
export const currentApiClient = createApiClient()

// Helper pour vérifier si on est en mode démo
export const isInDemoMode = (): boolean => IS_DEMO_MODE