// types/index.ts
export interface User {
  id: string
  email: string
  username: string
  isEmailVerified: boolean
  createdAt?: string
  updatedAt?: string
  message?: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  password: string
}

export interface ApiError {
  error: string
  code?: string
  field?: string
  message?: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  isEmailVerificationSent: boolean
  isEmailVerified: boolean
  successMessage: string | null
}