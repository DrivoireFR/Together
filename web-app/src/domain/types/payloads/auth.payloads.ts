export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  nom: string
  prenom: string
  pseudo: string
  email: string
  password: string
  icone?: string
}