export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data'
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  GROUPS: '/groups',
  GROUP_DETAIL: '/groups/:id',
  TASKS: '/tasks',
  PROFILE: '/profile'
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const