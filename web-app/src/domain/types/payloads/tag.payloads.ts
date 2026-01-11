import type { Icon } from '@/shared/types/enums'

export interface CreateTagPayload {
  label: string
  color: string
  groupId: number
  icon?: Icon
}

export interface UpdateTagPayload {
  label?: string
  color?: string
  icon?: Icon
}