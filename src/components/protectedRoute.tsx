// src/components/ProtectedRoute.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { RootState } from '@/redux/store'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireVerified?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireVerified = true 
}) => {
  const { isAuthenticated, isEmailVerified } = useSelector(
    (state: RootState) => state.auth
  )
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireVerified && !isEmailVerified) {
    return <Navigate 
      to="/login" 
      state={{ 
        from: location,
        error: 'Please verify your email before proceeding.' 
      }} 
      replace 
    />
  }

  return <>{children}</>
}

export default ProtectedRoute