export interface CreateGroupPayload {
  nom: string
}

export interface JoinGroupPayload {
  groupId: number
  code: string
}