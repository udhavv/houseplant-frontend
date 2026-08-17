// components/auth/GuestGuard.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { LoadingSpinner } from '../common/LoadingSpinner'

interface GuestGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function GuestGuard({ children, redirectTo = '/dashboard' }: GuestGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}