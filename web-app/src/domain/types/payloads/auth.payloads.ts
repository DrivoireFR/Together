import type { Avatar } from '@/shared/types/enums'

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
  avatar?: Avatar
}

export interface UpdateProfilePayload {
  nom?: string
  prenom?: string
  pseudo?: string
  avatar?: Avatar
}