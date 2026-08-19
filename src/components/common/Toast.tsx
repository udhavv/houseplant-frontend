// components/common/Toast.tsx
'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        loading: {
          duration: 2000,
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}