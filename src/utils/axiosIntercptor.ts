// src/utils/axiosInterceptor.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import { store } from '../redux/store'
import { logout, refreshToken } from '../redux/slices/authSlice'

// Configure base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000'

// Custom request config with retry flag
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Track if token refresh is in progress
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: Error | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(null)
    }
  })
  failedQueue = []
}

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig

    // Check if it's a token expired error
    if (
      error.response?.status === 401 &&
      (error.response?.data as any)?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If refresh is in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh token
        await store.dispatch(refreshToken()).unwrap()
        
        // Process queued requests
        processQueue(null)
        
        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError as Error)
        store.dispatch(logout())
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle 403 email not verified
    if (
      error.response?.status === 403 &&
      (error.response?.data as any)?.code === 'EMAIL_NOT_VERIFIED'
    ) {
      // Redirect to verification page or show modal
      // This can be handled in your components
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

// Helper function to set auth token in header (for mobile/API clients)
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export default api