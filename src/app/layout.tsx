// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/providers/ReduxProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { ToastProvider } from '@/components/common/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyApp - Authentication System',
  description: 'Secure authentication with HTTP-only cookies',
  keywords: 'authentication, nextjs, redux, typescript',
  authors: [{ name: 'Your Name' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}