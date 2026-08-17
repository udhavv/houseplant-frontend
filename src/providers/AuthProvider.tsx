// providers/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { checkAuth } from '@/redux/slices/authSlice'
import { AppDispatch } from '@/redux/store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap()
      } catch (error) {
        // User is not authenticated, which is fine
        console.debug('User not authenticated')
      }
    }

    initAuth()
  }, [dispatch])

  return <>{children}</>
}