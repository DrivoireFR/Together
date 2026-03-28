export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const STORAGE_KEYS = {
  TOKEN: 'together_token',
  USER: 'together_user',
  REMEMBER_ME: 'together_remember_me',
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const DIFFICULTY_DESCRIPTIONS: Record<number, string> = {
  1: 'Très facile',
  2: 'Facile',
  3: 'Assez facile',
  4: 'Moyen',
  5: 'Moyen+',
  6: 'Assez difficile',
  7: 'Difficile',
  8: 'Très difficile',
  9: 'Épuisant',
  10: 'Extrême',
};
