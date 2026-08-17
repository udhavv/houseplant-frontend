// store/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/services/auth.service'
import { User, AuthState } from '@/types'

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  isEmailVerificationSent: false,
  isEmailVerified: false,
}

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; username: string; password: string }) => {
    const response = await authService.register(data)
    return response
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const response = await authService.login(data)
    return response
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async () => {
    await authService.refreshToken()
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout()
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const response = await authService.getCurrentUser()
    return response
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string) => {
    const response = await authService.verifyEmail(token)
    return response
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string) => {
    const response = await authService.forgotPassword(email)
    return response
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }) => {
    const response = await authService.resetPassword(token, password)
    return response
  }
)

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async () => {
    const response = await authService.resendVerificationEmail()
    return response
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.isEmailVerified = false
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isEmailVerified = action.payload.isEmailVerified
    },
    resetEmailVerificationStatus: (state) => {
      state.isEmailVerificationSent = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.isEmailVerificationSent = false
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.isEmailVerificationSent = true
        state.isEmailVerified = false
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Registration failed'
        state.isEmailVerificationSent = false
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.isEmailVerified = action.payload.user.isEmailVerified
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
        state.isAuthenticated = false
        state.user = null
      })

      // Refresh token
      .addCase(refreshToken.fulfilled, (state) => {
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.isEmailVerified = false
      })
      .addCase(logout.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isEmailVerified = false
      })

      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.isEmailVerified = action.payload.user.isEmailVerified
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.isEmailVerified = false
      })

      // Verify email
      .addCase(verifyEmail.fulfilled, (state) => {
        state.error = null
        state.isEmailVerified = true
        if (state.user) {
          state.user.isEmailVerified = true
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.error = action.error.message || 'Email verification failed'
      })

      // Forgot password
      .addCase(forgotPassword.fulfilled, (state) => {
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.error.message || 'Password reset request failed'
      })

      // Reset password
      .addCase(resetPassword.fulfilled, (state) => {
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message || 'Password reset failed'
      })

      // Resend verification email
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.isEmailVerificationSent = true
        state.error = null
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to send verification email'
      })
  },
})

export const { 
  clearError, 
  clearAuth, 
  setUser,
  resetEmailVerificationStatus 
} = authSlice.actions

export default authSlice.reducer