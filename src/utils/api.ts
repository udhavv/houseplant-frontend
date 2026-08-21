// import axios, {
//   AxiosInstance,
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from 'axios'

// import { store } from '@/redux/store'
// import {
//   logout,
//   refreshToken,
// } from '@/redux/slices/authSlice'

// interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean
// }

// interface FailedRequest {
//   resolve: (value?: unknown) => void
//   reject: (reason?: unknown) => void
// }

// class ApiService {
//   private static instance: ApiService
//   private api: AxiosInstance

//   private isRefreshing = false
//   private failedQueue: FailedRequest[] = []

//   private constructor() {
//     this.api = axios.create({
//       baseURL:
//         process.env.NEXT_PUBLIC_API_URL ||
//         'http://localhost:5000/api',

//       // Required for HTTP-only cookies
//       withCredentials: true,

//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     this.setupInterceptors()
//   }

//   public static getInstance(): ApiService {
//     if (!ApiService.instance) {
//       ApiService.instance = new ApiService()
//     }

//     return ApiService.instance
//   }

//   private setupInterceptors() {
//     // -----------------------------
//     // Request interceptor
//     // -----------------------------
//     this.api.interceptors.request.use(
//       (config) => {
//         return config
//       },
//       (error) => {
//         return Promise.reject(error)
//       }
//     )

//     // -----------------------------
//     // Response interceptor
//     // -----------------------------
//     this.api.interceptors.response.use(
//       (response) => response,

//       async (error: AxiosError) => {
//         const originalRequest =
//           error.config as CustomAxiosRequestConfig | undefined

//         // No request config available
//         if (!originalRequest) {
//           return Promise.reject(error)
//         }

//         // Only handle 401
//         if (error.response?.status !== 401) {
//           return Promise.reject(error)
//         }

//         // Don't retry an already retried request
//         if (originalRequest._retry) {
//           return Promise.reject(error)
//         }

//         // Never try to refresh the refresh endpoint itself
//         if (originalRequest.url?.includes('/auth/refresh')) {
//           store.dispatch(logout())
//           return Promise.reject(error)
//         }

//         // ---------------------------------
//         // Another request is already
//         // refreshing the access token
//         // ---------------------------------
//         if (this.isRefreshing) {
//           return new Promise((resolve, reject) => {
//             this.failedQueue.push({
//               resolve,
//               reject,
//             })
//           }).then(() => {
//             return this.api(originalRequest)
//           })
//         }

//         // ---------------------------------
//         // Start refresh process
//         // ---------------------------------
//         originalRequest._retry = true
//         this.isRefreshing = true

//         try {
//           await store.dispatch(refreshToken()).unwrap()

//           // Refresh successful
//           this.processQueue(null)

//           // Retry original request
//           return this.api(originalRequest)
//         } catch (refreshError) {
//           // Refresh failed
//           this.processQueue(refreshError)

//           store.dispatch(logout())

//           return Promise.reject(refreshError)
//         } finally {
//           this.isRefreshing = false
//         }
//       }
//     )
//   }

//   private processQueue(error: unknown = null) {
//     this.failedQueue.forEach(({ resolve, reject }) => {
//       if (error) {
//         reject(error)
//       } else {
//         resolve()
//       }
//     })

//     this.failedQueue = []
//   }

//   public get(...args: Parameters<AxiosInstance['get']>) {
//     return this.api.get(...args)
//   }

//   public post(...args: Parameters<AxiosInstance['post']>) {
//     return this.api.post(...args)
//   }

//   public put(...args: Parameters<AxiosInstance['put']>) {
//     return this.api.put(...args)
//   }

//   public patch(...args: Parameters<AxiosInstance['patch']>) {
//     return this.api.patch(...args)
//   }

//   public delete(...args: Parameters<AxiosInstance['delete']>) {
//     return this.api.delete(...args)
//   }
  

// //   public get = this.api.get.bind(this.api)
// //   public post = this.api.post.bind(this.api)
// //   public put = this.api.put.bind(this.api)
// //   public patch = this.api.patch.bind(this.api)
// //   public delete = this.api.delete.bind(this.api)
// }

// export const api = ApiService.getInstance()














// utils/api.ts

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'

import { API_BASE_URL } from '@/utils/constants'

interface CustomAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean
}

type FailedRequest = {
  resolve: () => void
  reject: (reason?: unknown) => void
}

class ApiService {
  private static instance: ApiService

  private api: AxiosInstance
  private refreshClient: AxiosInstance

  private isRefreshing = false

  private failedQueue: FailedRequest[] = []

  private constructor() {
    /**
     * Main API client
     */
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
    })

    /**
     * Separate client for refreshing tokens.
     *
     * IMPORTANT:
     * This client has NO response interceptor.
     *
     * Therefore:
     *
     * /auth/refresh
     *      ↓
     * refreshClient
     *      ↓
     * response
     *
     * It cannot recursively trigger the refresh interceptor.
     */
    this.refreshClient = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }

    return ApiService.instance
  }

  private setupInterceptors(): void {
    /**
     * REQUEST INTERCEPTOR
     */
    this.api.interceptors.request.use(
      (config) => {
        config.params = {
          ...config.params,
          _t: Date.now(),
        }

        return config
      },

      (error) => Promise.reject(error)
    )

    /**
     * RESPONSE INTERCEPTOR
     */
    this.api.interceptors.response.use(
      (response) => response,

      async (error: AxiosError) => {
        const originalRequest =
          error.config as CustomAxiosRequestConfig | undefined

        /**
         * Network error
         */
        if (!error.response) {
          return Promise.reject({
            error: 'Network error. Please check your connection.',
          })
        }

        /**
         * No request config available
         */
        if (!originalRequest) {
          return Promise.reject(error)
        }

        /**
         * Only handle 401
         */
        if (error.response.status !== 401) {
          return Promise.reject(error)
        }

        /**
         * Don't retry the same request twice
         */
        if (originalRequest._retry) {
          return Promise.reject(error)
        }

        /**
         * NEVER try to refresh when the request itself
         * is the refresh endpoint.
         */
        if (originalRequest.url?.includes('/auth/refresh')) {
          return Promise.reject(error)
        }

        /**
         * If another request is already refreshing the token,
         * put this request into the queue.
         */
        if (this.isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            this.failedQueue.push({
              resolve,
              reject,
            })
          }).then(() => {
            originalRequest._retry = true

            return this.api(originalRequest)
          })
        }

        /**
         * We are the first request to encounter 401.
         */
        this.isRefreshing = true
        originalRequest._retry = true

        try {
          /**
           * Refresh token directly.
           *
           * IMPORTANT:
           * We do NOT use:
           *
           * store.dispatch(refreshToken())
           *
           * because that would recreate the circular dependency.
           */
          await this.refreshClient.post('/auth/refresh')

          /**
           * Refresh succeeded.
           */
          this.isRefreshing = false

          this.processQueue()

          /**
           * Retry the original request.
           */
          return this.api(originalRequest)
        } catch (refreshError) {
          /**
           * Refresh failed.
           */
          this.isRefreshing = false

          this.processQueue(refreshError)

          /**
           * Don't dispatch Redux actions here.
           *
           * The API layer should not know about Redux.
           *
           * The application can detect the rejected request
           * and clear auth state if necessary.
           */
          return Promise.reject(refreshError)
        }
      }
    )
  }

  /**
   * Resolve/reject all queued requests.
   */
  private processQueue(error?: unknown): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })

    this.failedQueue = []
  }

  /**
   * Public API methods
   */
  public get(...args: Parameters<AxiosInstance['get']>) {
    return this.api.get(...args)
  }

  public post(...args: Parameters<AxiosInstance['post']>) {
    // console.log("post request initiated with the args:- ", args)
    return this.api.post(...args)
  }

  public put(...args: Parameters<AxiosInstance['put']>) {
    return this.api.put(...args)
  }

  public patch(...args: Parameters<AxiosInstance['patch']>) {
    return this.api.patch(...args)
  }

  public delete(...args: Parameters<AxiosInstance['delete']>) {
    return this.api.delete(...args)
  }
}

export const api = ApiService.getInstance()