export interface CreateActionResponse {
  message: string
  action: {
    id: number
    date: string
    isHelpingHand: boolean
    task: {
      id: number
      label: string
      iconUrl: string | null
      points: number
      tag: {
        id: number
        label: string
        color: string
      } | null
    }
    user: {
      id: number
      pseudo: string
      avatar: string | null
    }
    group: {
      id: number
      nom: string
      code: string
    }
  }
  totalDone: number
}

export interface GetRecentActionsResponse {
  message: string
  actions: Action[]
  total: number
}