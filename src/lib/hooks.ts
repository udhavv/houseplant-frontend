// lib/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/redux/store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Custom auth hook
export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const isLoading = useAppSelector((state) => state.auth.isLoading)
  const error = useAppSelector((state) => state.auth.error)
  const isEmailVerified = useAppSelector((state) => state.auth.isEmailVerified)

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isEmailVerified,
  }
}