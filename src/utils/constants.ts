// utils/constants.ts
export const API_BASE_URL = process.env.API_URL || `http://localhost:4000/api/${process.env.VERSION}`

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
} as const

export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const

export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
] as const

export const EMAIL_VERIFICATION_INTERVAL = 5 * 60 * 1000 // 5 minutes



export const TOAST_DURATION = 5000 // 5 seconds

export const PASSWORD_MIN_LENGTH = 8
export const USERNAME_MIN_LENGTH = 3