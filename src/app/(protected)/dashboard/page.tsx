// // app/(protected)/dashboard/page.tsx
// 'use client'

// import { AuthGuard } from '@/components/auth/authGuard'
// import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner'
// import { Navbar } from '@/components/layout/Navbar'
// import { Footer } from '@/components/layout/Footer'
// import { useAuth } from '@/lib/hooks'

// export default function DashboardPage() {
//   const { user } = useAuth()

//   return (
//     <AuthGuard>
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Navbar />
        
//         <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <EmailVerificationBanner />
          
//           <div className="bg-white shadow rounded-lg p-6">
//             <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            
//             <div className="mt-6 space-y-4">
//               <div className="border-t border-gray-200 pt-4">
//                 <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Username</dt>
//                     <dd className="mt-1 text-sm text-gray-900">{user?.username}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Email</dt>
//                     <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Email Status</dt>
//                     <dd className="mt-1">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         user?.isEmailVerified 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
//                       </span>
//                     </dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Member Since</dt>
//                     <dd className="mt-1 text-sm text-gray-900">
//                       {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
//                     </dd>
//                   </div>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </main>
        
//         <Footer />
//       </div>
//     </AuthGuard>
//   )
// }













// app/(protected)/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthGuard } from '@/components/auth/authGuard'
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/lib/hooks'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PlantLifeCycle } from '@/components/dashboard/PlantLifeCycle'
import { PlantStats } from '@/components/dashboard/PlantStats'
import { PlantActions } from '@/components/dashboard/PlantActions'
import { PlantGrowthTimeline } from '@/components/dashboard/PlantGrowthTimeline'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [selectedStage, setSelectedStage] = useState('seed')
  const [plantData, setPlantData] = useState({
    health: 85,
    waterLevel: 70,
    growthStage: 'sprout',
    daysOld: 12,
    lastWatered: new Date(),
    experience: 450,
    level: 3,
    nextLevelXP: 600,
  })

  if (isLoading) {
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
          <PlantLifeCycle 
            currentStage={plantData.growthStage}
            health={plantData.health}
            waterLevel={plantData.waterLevel}
            daysOld={plantData.daysOld}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <PlantStats plantData={plantData} />
          </div>

          {/* Plant Actions */}
          <div className="mt-8">
            <PlantActions />
          </div>

          {/* Growth Timeline */}
          <div className="mt-8">
            <PlantGrowthTimeline />
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  )
}