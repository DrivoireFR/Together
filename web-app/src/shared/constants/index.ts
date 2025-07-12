export const API_BASE_URL = 'http://localhost:3000/api'

// Détection du mode démo
const isDemoMode = (): boolean => {
  // Vérifier si on est sur GitHub Pages ou autres plateformes de démo
  const hostname = window.location.hostname
  return hostname.indexOf('github.io') !== -1 || 
         hostname.indexOf('pages.dev') !== -1 ||
         hostname.indexOf('netlify.app') !== -1 ||
         hostname.indexOf('vercel.app') !== -1
}

export const IS_DEMO_MODE = isDemoMode()

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