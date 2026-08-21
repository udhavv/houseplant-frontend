// components/dashboard/PlantActions.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { waterPlant, resetPlant } from '@/redux/slices/plantSlice'
import { dailyCheckin } from '@/redux/slices/shopSlice'
import { showLoadingToast } from '@/utils/toast'
import toast from 'react-hot-toast'

const actions = [
  { 
    id: 'water', 
    label: 'Water Plant', 
    icon: '💧', 
    color: 'from-blue-500 to-blue-600',
    description: 'Give your plant a drink',
    requiresAlive: true
  },
  { 
    id: 'checkin', 
    label: 'Daily Check-in', 
    icon: '✅', 
    color: 'from-green-500 to-emerald-600',
    description: 'Earn daily rewards',
    requiresAlive: false
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
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleAction = async (actionId: string) => {
    setIsProcessing(actionId)
    const loadingToast = showLoadingToast('Processing...')

    try {
      switch (actionId) {
        case 'water':
          if (!plant?.isAlive) {
            toast.dismiss(loadingToast)
            toast.error('💀 Your plant is dead! Start a new one.')
            return
          }
          await dispatch(waterPlant()).unwrap()
          break
          
        case 'checkin':
          await dispatch(dailyCheckin()).unwrap()
          break
          
        case 'reset':
          await dispatch(resetPlant()).unwrap()
          break
      }
      toast.dismiss(loadingToast)
    } catch (error) {
      toast.dismiss(loadingToast)
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">🌻 Plant Care</h3>
      <p className="text-gray-600 text-sm mb-6">Take care of your plant with these actions</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const isDisabled = action.requiresAlive && !plant?.isAlive
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={!isDisabled && !isProcessing ? { scale: 1.05 } : {}}
              whileTap={!isDisabled && !isProcessing ? { scale: 0.95 } : {}}
              onClick={() => handleAction(action.id)}
              disabled={isDisabled || isProcessing !== null}
              className={`relative p-4 rounded-2xl text-center transition-all duration-300 ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-200'
                  : isProcessing === action.id
                  ? 'opacity-50 cursor-wait bg-gradient-to-br from-gray-400 to-gray-500'
                  : `bg-gradient-to-br ${action.color} text-white hover:shadow-lg`
              }`}
            >
              {isProcessing === action.id ? (
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
    </motion.div>
  )
}