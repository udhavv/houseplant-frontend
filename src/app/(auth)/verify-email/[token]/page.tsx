// app/(auth)/verify-email/[token]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch } from '@/lib/hooks'
import { verifyEmail } from '@/redux/slices/authSlice'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function VerifyEmailPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        await dispatch(verifyEmail(params.token)).unwrap()
        setStatus('success')
        setMessage('Your email has been verified successfully!')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } catch (error: any) {
        setStatus('error')
        setMessage(error.message || 'Invalid or expired verification token.')
      }
    }

    verify()
  }, [params.token, dispatch, router])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <LoadingSpinner size="lg" className="mx-auto" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Verifying your email...
              </h2>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Email Verified!
              </h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <p className="mt-2 text-sm text-gray-500">Redirecting to login...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Verification Failed
              </h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-4 space-y-2">
                <Link
                  href="/login"
                  className="block text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Go to login
                </Link>
                <Link
                  href="/forgot-password"
                  className="block text-sm text-gray-500 hover:text-gray-700"
                >
                  Need help? Contact support
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}