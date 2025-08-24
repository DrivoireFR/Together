export interface CreateGroupPayload {
  nom: string
}

export interface JoinGroupPayload {
  groupId: number
  code: string
}

export interface CreateBulkTagsPayload {
  tags: {
    label: string
    color: string
  }[]
}

export interface CreateBulkTasksPayload {
  tasks: {
    label: string
    frequenceEstimee: number
    uniteFrequence: string
    points: number
    tagLabel: string
  }[]
}