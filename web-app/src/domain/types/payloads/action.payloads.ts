export interface CreateActionPayload {
  taskId: number
  date: string
}

export interface CreateActionForMemberPayload {
  taskId: number
  date: string
  userId?: number  // Optionnel : si présent, crée l'action pour cet utilisateur
}