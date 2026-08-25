// components/dashboard/PlantActions.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { resetPlant, fetchPlant } from '@/redux/slices/plantSlice'
import { dailyCheckin, clearShopError } from '@/redux/slices/shopSlice'
import { showLoadingToast, showSuccessToast, showErrorToast, dismissToast } from '@/utils/toast'
import toast from 'react-hot-toast'

interface Action {
  id: string
  label: string
  icon: string
  color: string
  description: string
  requiresAlive: boolean
  cooldown?: number // Cooldown in milliseconds
}

const actions: Action[] = [
  { 
    id: 'checkin', 
    label: 'Daily Check-in', 
    icon: '✅', 
    color: 'from-green-500 to-emerald-600',
    description: 'Earn daily rewards',
    requiresAlive: false,
    cooldown: 24 * 60 * 60 * 1000 // 24 hours
  },
  { 
    id: 'reset', 
    label: 'New Plant', 
    icon: '🌱', 
    color: 'from-purple-500 to-pink-500',
    description: 'Start fresh',
    requiresAlive: false
  },
]

export function PlantActions() {
  const dispatch = useAppDispatch()
  const { plant } = useAppSelector((state) => state.plant)
  const { error: shopError, isLoading: shopLoading } = useAppSelector((state) => state.shop)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [lastCheckinTime, setLastCheckinTime] = useState<number | null>(null)
  const [isCooldown, setIsCooldown] = useState(false)
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current)
      }
    }
  }, [])

  // Watch for shop errors and show them as toasts
  useEffect(() => {
    if (shopError && isMountedRef.current) {
      let errorMessage = shopError
      
      if (shopError.toLowerCase().includes('already checked in')) {
        errorMessage = '✅ You already checked in today! Come back tomorrow.'
        // Set cooldown to prevent multiple requests
        setIsCooldown(true)
        setLastCheckinTime(Date.now())
        
        // Auto-reset cooldown after 1 minute (or you can use a longer time)
        if (cooldownTimerRef.current) {
          clearTimeout(cooldownTimerRef.current)
        }
        cooldownTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setIsCooldown(false)
          }
        }, 60000) // 1 minute cooldown
      }
      
      showErrorToast(errorMessage)
      dispatch(clearShopError())
    }
  }, [shopError, dispatch])

  // ====== OPTIMIZED: Use useCallback to prevent re-renders ======
  const handleAction = useCallback(async (actionId: string) => {
    // Prevent duplicate requests
    if (isProcessing || shopLoading) return
    
    // Check cooldown for checkin
    if (actionId === 'checkin' && isCooldown) {
      showErrorToast('⏳ Please wait before checking in again.')
      return
    }

    setIsProcessing(actionId)
    const loadingToast = showLoadingToast('Processing...')

    try {
      let result
      switch (actionId) {
        case 'checkin': {
          // Optimistic update - show immediate feedback
          showSuccessToast('🔄 Checking in...')
          
          result = await dispatch(dailyCheckin()).unwrap()
          
          dismissToast(loadingToast)
          
          // Show success message from response
          if (result?.message) {
            showSuccessToast(result.message)
          } else if (result?.coins) {
            showSuccessToast(`✅ Daily check-in complete! Earned ${result.coins} coins!`)
          } else {
            showSuccessToast('✅ Daily check-in complete!')
          }
          
          // Set cooldown
          setIsCooldown(true)
          setLastCheckinTime(Date.now())
          
          // Reset cooldown after 1 minute (prevents spam)
          if (cooldownTimerRef.current) {
            clearTimeout(cooldownTimerRef.current)
          }
          cooldownTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setIsCooldown(false)
            }
          }, 60000)
          
          // ====== OPTIMIZED: Only fetch plant if needed ======
          // Instead of full fetch, we can update the balance locally
          // But since we need updated plant data, we'll fetch
          await dispatch(fetchPlant())
          break
        }
          
        case 'reset': {
          result = await dispatch(resetPlant()).unwrap()
          dismissToast(loadingToast)
          
          if (result?.message) {
            showSuccessToast(result.message)
          } else {
            showSuccessToast('🌱 New plant sprouted!')
          }
          
          // Full refresh needed for reset
          await dispatch(fetchPlant())
          break
        }
      }
    } catch (error: any) {
      dismissToast(loadingToast)
      
      // Extract error message
      let errorMessage = 'Something went wrong. Please try again.'
      
      // Try to get message from error response
      if (error?.response?.data) {
        const data = error.response.data
        if (data.message) {
          errorMessage = data.message
        } else if (data.error) {
          errorMessage = data.error
        }
      } else if (error?.payload?.message) {
        errorMessage = error.payload.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      // Custom friendly messages
      if (errorMessage.toLowerCase().includes('already checked in')) {
        errorMessage = '✅ You already checked in today! Come back tomorrow.'
        setIsCooldown(true)
        if (cooldownTimerRef.current) {
          clearTimeout(cooldownTimerRef.current)
        }
        cooldownTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setIsCooldown(false)
          }
        }, 60000)
      } else if (errorMessage.toLowerCase().includes('dead')) {
        errorMessage = '💀 Your plant is dead! Please reset to start a new one.'
      }
      
      showErrorToast(errorMessage)
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(null)
      }
    }
  }, [dispatch, isProcessing, shopLoading, isCooldown])

  // ====== OPTIMIZED: Memoized cooldown display ======
  const getCooldownText = useCallback(() => {
    if (!lastCheckinTime || !isCooldown) return null
    const elapsed = Date.now() - lastCheckinTime
    const remaining = Math.max(0, 60000 - elapsed)
    const seconds = Math.ceil(remaining / 1000)
    if (seconds > 0) {
      return `⏳ ${seconds}s`
    }
    return null
  }, [lastCheckinTime, isCooldown])

  console.log('plant from plantActions:- ', plant)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">🌻 Plant Care</h3>
      <p className="text-gray-600 text-sm mb-6">Take care of your plant with these actions</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const isDisabled = action.requiresAlive && !plant?.isAlive
          const isProcessingThis = isProcessing === action.id
          const isCheckinCooldown = action.id === 'checkin' && isCooldown
          const cooldownText = action.id === 'checkin' ? getCooldownText() : null
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={!isDisabled && !isProcessingThis && !isCheckinCooldown ? { scale: 1.05 } : {}}
              whileTap={!isDisabled && !isProcessingThis && !isCheckinCooldown ? { scale: 0.95 } : {}}
              onClick={() => handleAction(action.id)}
              disabled={isDisabled || isProcessingThis || shopLoading || isCheckinCooldown}
              className={`relative p-4 rounded-2xl text-center transition-all duration-300 ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-200'
                  : isProcessingThis || isCheckinCooldown
                  ? 'opacity-50 cursor-wait bg-gradient-to-br from-gray-400 to-gray-500'
                  : `bg-gradient-to-br ${action.color} text-white hover:shadow-lg`
              }`}
            >
              {isProcessingThis ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-3xl"
                >
                  ⏳
                </motion.div>
              ) : (
                <>
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <div className="font-semibold text-sm">{action.label}</div>
                  <div className="text-xs opacity-80 mt-1">{action.description}</div>
                  {isCheckinCooldown && cooldownText && (
                    <div className="text-xs mt-2 bg-black/20 rounded-full px-2 py-0.5">
                      {cooldownText}
                    </div>
                  )}
                  {isDisabled && (
                    <div className="text-xs mt-2 bg-red-500/20 rounded-full px-2 py-0.5">
                      Needs alive plant
                    </div>
                  )}
                </>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Plant Status Indicator - Memoized with useMemo */}
      {plant && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
        >
          <div className="flex items-center justify-between text-sm flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="font-medium text-gray-700">{plant.growthStage || 'Sprout'}</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-gray-600">
                Health: <span className={`font-semibold ${plant.health > 70 ? 'text-green-600' : plant.health > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {plant.health}%
                </span>
              </span>
              <span className="text-gray-600">
                Level: <span className="font-semibold text-purple-600">{plant.level}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                plant.isAlive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {plant.isAlive ? 'Alive' : 'Deceased'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}