// services/auth.service.ts
import { api } from '../utils/api'
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types'

class AuthService {
  async register(data: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    return response.data
  }

  async login(data: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data)
    return response.data
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  }

  async refreshToken(): Promise<void> {
    await api.post('/auth/refresh')
  }

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get('/auth/me')
    return response.data
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.get(`/auth/verify-email/${token}`)
    return response.data
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post(`/auth/reset-password/${token}`, { password })
    return response.data
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    const response = await api.post('/auth/resend-verification')
    return response.data
  }
}

export const authService = new AuthService()