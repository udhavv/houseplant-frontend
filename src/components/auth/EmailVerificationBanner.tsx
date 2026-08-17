// components/auth/EmailVerificationBanner.tsx
'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { resendVerificationEmail } from '@/redux/slices/authSlice'

export function EmailVerificationBanner() {
  const dispatch = useAppDispatch()
  const { user, isEmailVerified } = useAppSelector((state) => state.auth)
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!user || isEmailVerified) {
    return null
  }

  const handleResend = async () => {
    setIsResending(true)
    setMessage(null)
    try {
      await dispatch(resendVerificationEmail()).unwrap()
      setMessage('Verification email sent! Please check your inbox.')
    } catch (error) {
      setMessage('Failed to send verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            Please verify your email address to access all features.
          </p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600 disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend verification email'}
          </button>
          {message && (
            <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}