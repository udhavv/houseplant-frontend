// app/(protected)/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AuthGuard } from '@/components/auth/authGuard'
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PlantLifeCycle } from '@/components/dashboard/PlantLifeCycle'
import { PlantStats } from '@/components/dashboard/PlantStats'
import { PlantActions } from '@/components/dashboard/PlantActions'
import { PlantGrowthTimeline } from '@/components/dashboard/PlantGrowthTimeline'
import { ShopPanel } from '@/components/dashboard/ShopPanel'
import { 
  fetchPlant, 
  fetchPlantMilestones, 
  fetchPlantCareLogs 
} from '@/redux/slices/plantSlice'
import { getBalance } from '@/redux/slices/shopSlice'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const { plant, isLoading: plantLoading, milestones, careLogs } = useAppSelector((state) => state.plant)
  const { coins, isLoading: shopLoading } = useAppSelector((state) => state.shop)
  
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await Promise.all([
          dispatch(fetchPlant()).unwrap(),
          dispatch(getBalance()).unwrap(),
          // dispatch(getTransactions()).unwrap(),
          dispatch(fetchPlantMilestones()).unwrap(),
          dispatch(fetchPlantCareLogs()).unwrap(),
        ])
      } catch (error) {
        console.error('Failed to initialize dashboard:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    if (!authLoading) {
      initializeDashboard()
    }
  }, [dispatch, authLoading])

  if (authLoading || !isInitialized || plantLoading || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Navbar />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmailVerificationBanner />
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              🌱 Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">Your digital garden is thriving</p>
          </motion.div>

          {/* Plant Life Cycle Visualization */}
          {plant && (
            <PlantLifeCycle plant={plant} />
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            <PlantStats plant={plant} coins={coins} />
          </div>

          {/* Shop Panel */}
          <div className="mt-8">
            <ShopPanel />
          </div>

          {/* Plant Actions */}
          <div className="mt-8">
            <PlantActions />
          </div>

          {/* Growth Timeline */}
          <div className="mt-8">
            <PlantGrowthTimeline plant={plant} />
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  )
}